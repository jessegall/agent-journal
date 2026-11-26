package recording

import (
	"errors"
	"io"
)

// RecordKeys copies every byte it reads into the record, unchanged, and draws what was typed on the screen: text, a
// paste's text included, as it came, Enter as a new line, any other key as nothing. It returns at the end of input.
func RecordKeys(input io.Reader, record io.Writer, screen io.Writer) error {
	buffer := make([]byte, 4096)
	for {
		count, err := input.Read(buffer)
		if count > 0 {
			if _, writeErr := record.Write(buffer[:count]); writeErr != nil {
				return writeErr
			}
			if drawErr := drawTyped(screen, buffer[:count]); drawErr != nil {
				return drawErr
			}
		}
		if errors.Is(err, io.EOF) {
			return nil
		}
		if err != nil {
			return err
		}
	}
}

func drawTyped(screen io.Writer, read []byte) error {
	for _, piece := range typedOf(read) {
		drawn := piece.Bytes
		if piece.Type == TypedKey {
			drawn = nil
			if string(piece.Bytes) == "\r" {
				drawn = []byte("\r\n")
			}
		}
		if _, err := screen.Write(drawn); err != nil {
			return err
		}
	}

	return nil
}
