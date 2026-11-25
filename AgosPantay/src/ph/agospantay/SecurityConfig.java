package ph.agospantay;

import java.io.IOException;
import java.util.Map;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.crypto.password.Pbkdf2PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.DispatcherType;
import jakarta.servlet.http.HttpServletResponse;

@Configuration
class SecurityConfig {
    @Bean
    PasswordEncoder passwordEncoder() {
        return Pbkdf2PasswordEncoder.defaultsForSpringSecurity_v5_8();
    }

    @Bean
    SecurityFilterChain webSecurity(HttpSecurity http, ObjectMapper json) throws Exception {
        return http
            .authorizeHttpRequests(rules -> rules
                .dispatcherTypeMatchers(DispatcherType.FORWARD, DispatcherType.ERROR).permitAll()
                .requestMatchers(HttpMethod.GET, "/", "/index.html", "/*.css", "/*.js", "/vendor/**", "/api/csrf").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/login", "/api/register").permitAll()
                .requestMatchers("/api/session", "/api/logout").authenticated()
                .requestMatchers("/admin.html", "/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/resident.html", "/api/resident/**", "/api/reports", "/api/requests").hasRole("RESIDENT")
                .anyRequest().denyAll())
            .requestCache(AbstractHttpConfigurer::disable)
            .formLogin(login -> login.loginPage("/index.html").loginProcessingUrl("/api/login")
                .successHandler((request, response, auth) -> writeJson(response, 200, json, Map.of("page", portal(auth))))
                .failureHandler((request, response, error) ->
                    writeJson(response, 401, json, Map.of("message", "Sign-in failed. Check your username, password, and account status."))))
            .logout(logout -> logout.logoutUrl("/api/logout").deleteCookies("JSESSIONID")
                .logoutSuccessHandler((request, response, auth) -> response.setStatus(204)))
            .exceptionHandling(errors -> errors
                .authenticationEntryPoint((request, response, error) -> {
                    if (request.getServletPath().startsWith("/api/")) {
                        writeJson(response, 401, json, Map.of("message", "Sign in to continue."));
                    } else {
                        response.sendRedirect("/");
                    }
                })
                .accessDeniedHandler((request, response, error) -> {
                    String path = request.getServletPath();
                    if ("/admin.html".equals(path) || "/resident.html".equals(path)) {
                        response.sendRedirect(portal(SecurityContextHolder.getContext().getAuthentication()));
                    } else {
                        writeJson(response, 403, json, Map.of("message", "This action is unavailable for your session. Refresh the page or sign in again."));
                    }
                }))
            .build();
    }

    private String portal(Authentication auth) {
        if (auth != null) {
            var roles = auth.getAuthorities();
            if (roles.stream().anyMatch(role -> "ROLE_ADMIN".equals(role.getAuthority()))) 
                return "/admin.html";
            if (roles.stream().anyMatch(role -> "ROLE_RESIDENT".equals(role.getAuthority()))) 
                return "/resident.html";
        }
        return "/";
    }

    private void writeJson(HttpServletResponse response, int status, ObjectMapper json, Object body) throws IOException {
        response.setStatus(status);
        response.setContentType("application/json");
        json.writeValue(response.getOutputStream(), body);
    }
}
