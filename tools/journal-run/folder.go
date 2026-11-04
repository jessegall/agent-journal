package main

import (
	"bytes"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"
)

const (
	commandSuffix  = "command"
	filteredSuffix = "filtered"
	cutLine        = "[this output grew past its limit: the oldest lines were dropped]\n"
	// mostReadBytes is the end of an output the runner reads into memory, whatever the size of the file.
	mostReadBytes = 16 << 20
	countBuffer   = 1 << 16
)

// OutputSize is the bytes and the lines of an output.
type OutputSize struct {
	Bytes int
	Lines int
}

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

func (folder Folder) Exists() bool {
	_, err := os.Stat(folder.Path)
	return err == nil
}

func (folder Folder) WritePid(pid int) error {
	return os.WriteFile(filepath.Join(folder.Path, "pid"), []byte(strconv.Itoa(pid)), 0o644)
}

func (folder Folder) Pid() (int, bool) { return folder.number("pid") }

func (folder Folder) Status(position int) (int, bool) {
	return folder.number(fmt.Sprintf("%d.status", position))
}

// Started says the shell began the part: it writes the part's started file just before it runs it.
func (folder Folder) Started(position int) bool {
	_, err := os.Stat(filepath.Join(folder.Path, fmt.Sprintf("%d.started", position)))
	return err == nil
}

func (folder Folder) End() (int, bool) { return folder.number("end") }

// MoveAsked says the journal wants the run in the background now, because a message waits for its agent.
func (folder Folder) MoveAsked() bool {
	_, err := os.Stat(filepath.Join(folder.Path, "move"))
	return err == nil
}

func (folder Folder) WriteEnd(code int) error {
	return os.WriteFile(filepath.Join(folder.Path, "end"), []byte(strconv.Itoa(code)), 0o644)
}

func (folder Folder) outputPath(position int) string {
	return filepath.Join(folder.Path, fmt.Sprintf("%d.out", position))
}

func (folder Folder) filteredPath(position int) string {
	return filepath.Join(folder.Path, fmt.Sprintf("%d.%s", position, filteredSuffix))
}

// Output is the end of a part's stored output.
func (folder Folder) Output(position int) string {
	text, _ := readEnd(folder.outputPath(position), mostReadBytes)
	return string(text)
}

// Result is what the agent asked for of a part, at most its last bytes: what its pipes printed, else its output.
func (folder Folder) Result(position, mostBytes int) (string, OutputSize) {
	path := folder.outputPath(position)
	if _, err := os.Stat(folder.filteredPath(position)); err == nil {
		path = folder.filteredPath(position)
	}
	text, _ := readEnd(path, mostBytes)
	return string(text), fileSize(path)
}

// CommandFailed says a part stripped of its pipes ended with a code of its own that is not 0.
func (folder Folder) CommandFailed(position int) bool {
	code, written := folder.number(fmt.Sprintf("%d.%s", position, commandSuffix))
	return written && code != 0
}

// Sizes are the bytes and the lines of every part's output.
func (folder Folder) Sizes(parts int) (int, int) {
	total := OutputSize{}
	for position := 1; position <= parts; position++ {
		size := fileSize(folder.outputPath(position))
		total.Bytes += size.Bytes
		total.Lines += size.Lines
	}
	return total.Bytes, total.Lines
}

// CutOutput keeps a growing output under the limit: past it, only the last half stays in the file, under a line that
// says so. The command goes on writing to the end of the file.
func (folder Folder) CutOutput(position, mostBytes int) {
	path := folder.outputPath(position)
	info, err := os.Stat(path)
	if mostBytes <= 0 || err != nil || info.Size() <= int64(mostBytes) {
		return
	}
	if _, err := os.Stat(folder.filteredPath(position)); err == nil {
		return
	}
	kept, err := readEnd(path, mostBytes/2)
	if err != nil {
		return
	}
	file, err := os.OpenFile(path, os.O_WRONLY|os.O_TRUNC|os.O_APPEND, 0o644)
	if err != nil {
		return
	}
	defer file.Close()
	_, _ = file.Write(append([]byte(cutLine), kept...))
}

func readEnd(path string, most int) ([]byte, error) {
	file, err := os.Open(path)
	if err != nil {
		return nil, err
	}
	defer file.Close()
	if end, err := file.Seek(0, io.SeekEnd); err == nil && end > int64(most) {
		_, _ = file.Seek(-int64(most), io.SeekEnd)
	} else {
		_, _ = file.Seek(0, io.SeekStart)
	}
	return io.ReadAll(file)
}

func fileSize(path string) OutputSize {
	file, err := os.Open(path)
	if err != nil {
		return OutputSize{}
	}
	defer file.Close()
	size, last, buffer := OutputSize{}, byte('\n'), make([]byte, countBuffer)
	for {
		count, err := file.Read(buffer)
		if count > 0 {
			size.Bytes += count
			size.Lines += bytes.Count(buffer[:count], []byte{'\n'})
			last = buffer[count-1]
		}
		if err != nil {
			break
		}
	}
	if last != '\n' {
		size.Lines++
	}
	return size
}

// WriteHeartbeat writes the time of the runner's last sign of life into the heartbeat file, as the module reads it.
func (folder Folder) WriteHeartbeat() {
	_ = os.WriteFile(filepath.Join(folder.Path, "heartbeat"), []byte(time.Now().UTC().Format("2006-01-02T15:04:05.000000+00:00")), 0o644)
}

func (folder Folder) number(name string) (int, bool) {
	text, err := os.ReadFile(filepath.Join(folder.Path, name))
	if err != nil {
		return 0, false
	}
	value, err := strconv.Atoi(strings.TrimSpace(string(text)))
	return value, err == nil
}
