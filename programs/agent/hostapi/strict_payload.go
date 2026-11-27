package hostapi

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"reflect"
	"strconv"
	"strings"
)

// validated is a payload the generated protocol checks once it is read: each enum holds one of its values.
type validated interface {
	Validate() error
}

// carrying is the executor of an order with a payload: it reads the payload strictly into its type, validates it and
// hands it to the handler, refusing as unsafe what fails either.
func carrying[T validated](handler func(context.Context, Order, T) (map[string]any, error)) Executor {
	return func(ctx context.Context, order Order) (map[string]any, error) {
		payload, err := DecodePayload[T](order)
		if err != nil {
			return nil, err
		}
		if err := payload.Validate(); err != nil {
			return nil, RefusalError{Refusal: Unsafe, Reason: "the payload of " + order.Type + " " + err.Error()}
		}
		return handler(ctx, order, payload)
	}
}

// carryingNothing is the executor of an order without a payload: one whose payload holds any field is refused.
func carryingNothing(handler func(context.Context, Order) (map[string]any, error)) Executor {
	return func(ctx context.Context, order Order) (map[string]any, error) {
		if _, err := DecodePayload[struct{}](order); err != nil {
			return nil, err
		}
		return handler(ctx, order)
	}
}

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
	if !bytes.HasPrefix(bytes.TrimSpace(text), []byte("{")) {
		return errors.New("is not an object")
	}
	if missing := missingField(reflect.TypeOf(into).Elem(), text, ""); missing != "" {
		return errors.New("misses its field " + missing)
	}
	return nil
}

// missingField is the path of the first field the shape needs that the JSON text leaves out, down every object and
// list of objects it holds; none when each is there.
func missingField(shape reflect.Type, text json.RawMessage, path string) string {
	for shape.Kind() == reflect.Pointer {
		shape = shape.Elem()
	}
	trimmed := bytes.TrimSpace(text)
	if shape.Kind() == reflect.Slice && bytes.HasPrefix(trimmed, []byte("[")) {
		var items []json.RawMessage
		if json.Unmarshal(trimmed, &items) != nil {
			return ""
		}
		for index, item := range items {
			if missing := missingField(shape.Elem(), item, path+"["+strconv.Itoa(index)+"]"); missing != "" {
				return missing
			}
		}
		return ""
	}
	if shape.Kind() != reflect.Struct || !bytes.HasPrefix(trimmed, []byte("{")) {
		return ""
	}
	var present map[string]json.RawMessage
	if json.Unmarshal(trimmed, &present) != nil {
		return ""
	}
	for _, field := range reflect.VisibleFields(shape) {
		name, isNeeded := jsonNameOf(field)
		if name == "" {
			continue
		}
		value, isPresent := present[name]
		if !isPresent && isNeeded {
			return path + name
		}
		if missing := missingField(field.Type, value, path+name+"."); isPresent && missing != "" {
			return missing
		}
	}
	return ""
}

// jsonNameOf is a field's JSON name, none for one JSON leaves out, and whether a payload must hold it: every field
// without omitempty.
func jsonNameOf(field reflect.StructField) (string, bool) {
	if !field.IsExported() || field.Anonymous {
		return "", false
	}
	name, options, _ := strings.Cut(field.Tag.Get("json"), ",")
	if name == "-" {
		return "", false
	}
	if name == "" {
		name = field.Name
	}
	return name, !strings.Contains(options, "omitempty") && !strings.Contains(options, "omitzero")
}
