package host

import (
	"errors"
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
	for _, folder := range folders {
		for _, path := range folder.Paths() {
			if err := checkInside(path); err != nil {
				return nil, err
			}
		}
	}

	arguments := []string{}
	for _, folder := range folders {
		absolute := filepath.Join(settingsFolder, folder.Name)
		if err := writeStartFiles(absolute, folder.Files); err != nil {
			return nil, err
		}
		arguments = append(arguments, folder.ArgumentsAt(absolute)...)
	}

	return arguments, nil
}

// writeStartFiles writes the files into the folder, replacing any earlier copy of it.
func writeStartFiles(folder string, files []client.StartFile) error {
	if err := os.RemoveAll(folder); err != nil {
		return err
	}
	for _, file := range files {
		target := filepath.Join(folder, file.Path)
		if err := os.MkdirAll(filepath.Dir(target), 0o700); err != nil {
			return err
		}
		if err := os.WriteFile(target, []byte(file.Content), 0o600); err != nil {
			return err
		}
	}
	return nil
}

// RequireNoLinks refuses a settings folder with a link anywhere from the state folder down to it: a link there
// could send a start's generated settings into the account folder or the work folder.
func RequireNoLinks(stateFolder, settingsFolder string) error {
	relative, err := filepath.Rel(stateFolder, settingsFolder)
	if err != nil || checkInside(relative) != nil {
		return fmt.Errorf("the settings folder %s is not inside the host state %s", settingsFolder, stateFolder)
	}
	path := stateFolder
	for _, part := range strings.Split(relative, string(filepath.Separator)) {
		path = filepath.Join(path, part)
		info, err := os.Lstat(path)
		if errors.Is(err, os.ErrNotExist) {
			return nil
		}
		if err != nil {
			return err
		}
		if info.Mode()&os.ModeSymlink != 0 {
			return fmt.Errorf("the settings folder passes through the link %s", path)
		}
	}
	return nil
}

func checkInside(path string) error {
	clean := filepath.Clean(path)
	if path == "" || filepath.IsAbs(path) || clean == "." || clean == ".." || strings.HasPrefix(clean, "../") {
		return fmt.Errorf("the start path %q leaves the settings folder", path)
	}
	return nil
}
