package main

import (
	"fmt"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"
)

// Folder is the run's folder under .journal/processes/<number>/, which the module reads: the line, the parts, the
// pid of the group leader, each part's output and status, the end and the heartbeat.
type Folder struct {
	Path string
}

func NewFolder(home string, process int) Folder {
	return Folder{Path: filepath.Join(home, "processes", strconv.Itoa(process))}
}

func (folder Folder) Start(line string, parts []Part, script string) error {
	if err := os.MkdirAll(folder.Path, 0o755); err != nil {
		return err
	}
	texts := make([]string, len(parts))
	for index, part := range parts {
		texts[index] = part.Text
	}
	files := map[string]string{"line": line, "parts": strings.Join(texts, "\n"), "run.sh": script}
	for name, text := range files {
		if err := os.WriteFile(filepath.Join(folder.Path, name), []byte(text), 0o644); err != nil {
			return err
		}
	}
	return nil
}

func (folder Folder) Script() string { return filepath.Join(folder.Path, "run.sh") }

func (folder Folder) WritePid(pid int) error {
	return os.WriteFile(filepath.Join(folder.Path, "pid"), []byte(strconv.Itoa(pid)), 0o644)
}

func (folder Folder) Pid() (int, bool) { return folder.number("pid") }

func (folder Folder) Status(position int) (int, bool) {
	return folder.number(fmt.Sprintf("%d.status", position))
}

func (folder Folder) End() (int, bool) { return folder.number("end") }

func (folder Folder) WriteEnd(code int) error {
	return os.WriteFile(filepath.Join(folder.Path, "end"), []byte(strconv.Itoa(code)), 0o644)
}

func (folder Folder) Output(position int) string {
	text, _ := os.ReadFile(filepath.Join(folder.Path, fmt.Sprintf("%d.out", position)))
	return string(text)
}

// Sizes are the bytes and the lines of every part's output.
func (folder Folder) Sizes(parts int) (int, int) {
	bytes, lines := 0, 0
	for position := 1; position <= parts; position++ {
		text := folder.Output(position)
		bytes += len(text)
		lines += strings.Count(text, "\n")
		if text != "" && !strings.HasSuffix(text, "\n") {
			lines++
		}
	}
	return bytes, lines
}

func (folder Folder) Beat() {
	path := filepath.Join(folder.Path, "heartbeat")
	now := time.Now()
	if err := os.Chtimes(path, now, now); err != nil {
		_ = os.WriteFile(path, nil, 0o644)
	}
}

func (folder Folder) number(name string) (int, bool) {
	text, err := os.ReadFile(filepath.Join(folder.Path, name))
	if err != nil {
		return 0, false
	}
	value, err := strconv.Atoi(strings.TrimSpace(string(text)))
	return value, err == nil
}
