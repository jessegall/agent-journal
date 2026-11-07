package anonymise

import (
	"bufio"
	"bytes"
	"encoding/json"
	"fmt"
	"io"
)

// Bodies anonymises a stream of JSON bodies, one a line: every string value inside each body, so the body stays valid JSON
// and keeps the whitespace of its texts.
func (anonymiser Anonymiser) Bodies(input io.Reader, output io.Writer) error {
	scanner := bufio.NewScanner(input)
	scanner.Buffer(make([]byte, 0, 1<<20), 256<<20)
	writer := bufio.NewWriter(output)
	for number := 1; scanner.Scan(); number++ {
		decoder := json.NewDecoder(bytes.NewReader(scanner.Bytes()))
		decoder.UseNumber()
		var body any
		if err := decoder.Decode(&body); err != nil {
			return fmt.Errorf("line %d is not a JSON body: %w", number, err)
		}
		encoder := json.NewEncoder(writer)
		encoder.SetEscapeHTML(false)
		if err := encoder.Encode(anonymiser.value(body)); err != nil {
			return err
		}
	}
	if err := scanner.Err(); err != nil {
		return err
	}
	return writer.Flush()
}

func (anonymiser Anonymiser) value(value any) any {
	switch value := value.(type) {
	case string:
		return anonymiser.Replaced(value)
	case map[string]any:
		for key, inner := range value {
			value[key] = anonymiser.value(inner)
		}
	case []any:
		for i, inner := range value {
			value[i] = anonymiser.value(inner)
		}
	}
	return value
}
