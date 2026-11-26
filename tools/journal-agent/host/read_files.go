package host

import (
	"fmt"
	"os"
)

// OpenReadFiles opens each file a plan names for the program to read, in order, so the first becomes the child's
// descriptor 3; the caller closes them once the child started.
func OpenReadFiles(paths []string) ([]*os.File, error) {
	files := make([]*os.File, 0, len(paths))
	for _, path := range paths {
		file, err := os.Open(path)
		if err != nil {
			CloseFiles(files)
			return nil, fmt.Errorf("a file the start reads could not be opened: %w", err)
		}
		files = append(files, file)
	}
	return files, nil
}

// CloseFiles closes the parent's copies of the files a started child reads.
func CloseFiles(files []*os.File) {
	for _, file := range files {
		_ = file.Close()
	}
}
