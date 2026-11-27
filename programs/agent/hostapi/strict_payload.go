package hostapi

import (
	"bytes"
	"encoding/json"
	"errors"
	"reflect"
	"strings"
)

// DecodePayload reads an order's payload into its shape, strictly: a field the shape does not have, a field it needs
// that is missing, or a value of the wrong type is refused as unsafe, by the field's name and the order's type.
func DecodePayload[T any](order Order) (T, error) {
	var decoded T
	if err := decodeStrictly([]byte(order.Payload), &decoded); err != nil {
		return decoded, RefusalError{Refusal: Unsafe, Reason: "the payload of " + order.Type + " " + err.Error()}
	}
	return decoded, nil
}

func decodeStrictly(text []byte, into any) error {
	decoder := json.NewDecoder(bytes.NewReader(text))
	decoder.DisallowUnknownFields()
	if err := decoder.Decode(into); err != nil {
		var mistyped *json.UnmarshalTypeError
		if errors.As(err, &mistyped) {
			return errors.New("holds " + mistyped.Field + " as " + mistyped.Value + ", not " + mistyped.Type.String())
		}
		if field, isUnknown := strings.CutPrefix(err.Error(), "json: unknown field "); isUnknown {
			return errors.New("holds the field " + field + ", which the protocol does not know")
		}
		return errors.New("does not read: " + err.Error())
	}
	var present map[string]json.RawMessage
	if err := json.Unmarshal(text, &present); err != nil {
		return errors.New("is not an object: " + err.Error())
	}
	for _, name := range neededFields(reflect.TypeOf(into).Elem()) {
		if _, isPresent := present[name]; !isPresent {
			return errors.New("misses its field " + name)
		}
	}
	return nil
}

// neededFields are the JSON names of a shape's fields that carry no omitempty, so a payload must hold each.
func neededFields(shape reflect.Type) []string {
	needed := []string{}
	if shape.Kind() != reflect.Struct {
		return needed
	}
	for _, field := range reflect.VisibleFields(shape) {
		if !field.IsExported() || field.Anonymous {
			continue
		}
		name, options, _ := strings.Cut(field.Tag.Get("json"), ",")
		if name == "-" || strings.Contains(options, "omitempty") || strings.Contains(options, "omitzero") {
			continue
		}
		if name == "" {
			name = field.Name
		}
		needed = append(needed, name)
	}
	return needed
}
