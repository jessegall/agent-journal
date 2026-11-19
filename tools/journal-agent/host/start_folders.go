package host

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"journal-agent/client"
)

// WriteStartFolders writes the folders a grant names inside the start's isolated settings folder, replacing any
// earlier copy, and returns the arguments that point the program at them. A name or path that would leave the
// settings folder is refused before anything is written.
func WriteStartFolders(settingsFolder string, folders []client.StartFolder) ([]string, error) {
	arguments := []string{}

	for _, folder := range folders {
		if err := checkInside(folder.Name); err != nil {
			return nil, err
		}
		for _, file := range folder.Files {
			if err := checkInside(file.Path); err != nil {
				return nil, err
			}
		}
	}

	for _, folder := range folders {
		absolute := filepath.Join(settingsFolder, folder.Name)
		if err := os.RemoveAll(absolute); err != nil {
			return nil, err
		}
		for _, file := range folder.Files {
			target := filepath.Join(absolute, file.Path)
			if err := os.MkdirAll(filepath.Dir(target), 0o700); err != nil {
				return nil, err
			}
			if err := os.WriteFile(target, []byte(file.Content), 0o600); err != nil {
				return nil, err
			}
		}
		if len(folder.Arguments) > 0 {
			arguments = append(arguments, folder.Arguments...)
			arguments = append(arguments, absolute)
		}
	}

	return arguments, nil
}

func checkInside(path string) error {
	clean := filepath.Clean(path)
	if path == "" || filepath.IsAbs(path) || clean == "." || clean == ".." || strings.HasPrefix(clean, "../") {
		return fmt.Errorf("the start path %q leaves the settings folder", path)
	}
	return nil
}
