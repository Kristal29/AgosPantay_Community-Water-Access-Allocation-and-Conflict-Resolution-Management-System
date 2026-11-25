package ph.agospantay;

import java.util.Collection;
import java.util.Locale;

import com.fasterxml.jackson.databind.JsonNode;

final class Input {
    private Input() {
    }

    static String text(JsonNode body, String field, String label) {
        JsonNode node = body.path(field);
        if (node.isMissingNode() || node.isNull()) {
            return "";
        }
        if (!node.isTextual()) {
            throw ApiProblem.badRequest(label + " must be text.");
        }
        return node.asText().strip();
    }

    static String required(JsonNode body, String field, String label, int maxLength) {
        return required(text(body, field, label), label, maxLength);
    }

    static String required(String value, String label, int maxLength) {
        if (value.isBlank()) {
            throw ApiProblem.badRequest(label + " is required.");
        }
        checkLength(value, label, maxLength);
        return value;
    }

    static String optional(JsonNode body, String field, String label, int maxLength) {
        String value = text(body, field, label);
        checkLength(value, label, maxLength);
        return value;
    }

    static String choice(JsonNode body, String field, String label, Collection<String> choices) {
        return choice(text(body, field, label), label, choices);
    }

    static String choice(String value, String label, Collection<String> choices) {
        required(value, label, 100);
        if (!choices.contains(value)) {
            throw ApiProblem.badRequest("Choose a valid " + label.toLowerCase(Locale.ROOT) + ".");
        }
        return value;
    }

    static int wholeNumber(JsonNode body, String field, String label) {
        JsonNode node = body.path(field);
        if (!node.isIntegralNumber() || !node.canConvertToInt()) {
            throw ApiProblem.badRequest(label + " must be a whole number.");
        }
        return node.asInt();
    }

    static int integer(JsonNode body, String field, String label, int min, int max) {
        int value = wholeNumber(body, field, label);
        requireRange(value, label, min, max);
        return value;
    }

    static void requireRange(int value, String label, int min, int max) {
        if (value < min || value > max) {
            throw ApiProblem.badRequest(label + " must be a whole number from " + min + " to " + max + ".");
        }
    }

    private static void checkLength(String value, String label, int maxLength) {
        if (value.length() > maxLength) {
            throw ApiProblem.badRequest(label + " must be " + maxLength + " characters or fewer.");
        }
    }
}

