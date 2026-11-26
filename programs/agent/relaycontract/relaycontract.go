// Package relaycontract compares what a Go relay sends and prints with the exchange the PHP relay's test wrote under
// tests/Contracts/relays, so both relays are held to one file.
package relaycontract

import (
	"encoding/json"
	"net/http"
	"reflect"
	"strings"
)

// Headers are the headers of a call both relays must send alike: those whose name starts with one of compared, by
// lowercase name, a varying one written as "varies".
func Headers(headers http.Header, compared []string, varying []string) map[string]string {
	kept := map[string]string{}
	for name, values := range headers {
		lower := strings.ToLower(name)
		for _, start := range compared {
			if strings.HasPrefix(lower, start) {
				kept[lower] = strings.Join(values, ", ")
			}
		}
		for _, differs := range varying {
			if lower == differs {
				kept[lower] = "varies"
			}
		}
	}

	return kept
}

// SameJSON tells whether two values read the same as JSON, so numbers and maps compare alike whichever side decoded
// them.
func SameJSON(actual any, expected any) (bool, error) {
	left, err := normal(actual)
	if err != nil {
		return false, err
	}
	right, err := normal(expected)
	if err != nil {
		return false, err
	}

	return reflect.DeepEqual(left, right), nil
}

func normal(value any) (any, error) {
	encoded, err := json.Marshal(value)
	if err != nil {
		return nil, err
	}
	var decoded any
	err = json.Unmarshal(encoded, &decoded)

	return decoded, err
}
