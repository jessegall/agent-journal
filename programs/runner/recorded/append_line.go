package recorded

import (
	"fmt"
	"os"
)

// AppendLine adds the line to the file, made when missing.
func AppendLine(path, line string) error {
	opened, err := os.OpenFile(path, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0o600)
	if err != nil {
		return err
	}
	defer opened.Close()
	_, err = fmt.Fprintln(opened, line)
	return err
}
