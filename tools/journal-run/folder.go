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
	outputSuffix   = "out"
	cutBytesSuffix = "cut-bytes"
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
	texts := make([]string, PartCount(parts))
	for _, part := range parts {
		texts[part.Position-1] = part.Text
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

// Output is the end of a part's stored output.
func (folder Folder) Output(position int) string {
	text, _ := readEnd(folder.outputPath(position), mostReadBytes)
	return string(text)
}

// OutputEnd is the end of a part's output, at most its last bytes, and the size of the whole.
func (folder Folder) OutputEnd(position, mostBytes int) (string, OutputSize) {
	outputPath := folder.outputPath(position)
	text, _ := readEnd(outputPath, mostBytes)
	return string(text), fileSize(outputPath)
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
	if cut := cutFile(folder.outputPath(position), mostBytes); cut > 0 {
		folder.addCutBytes(position, cut)
	}
}

// cutFile cuts a file past the limit and returns how many bytes it became shorter by.
func cutFile(path string, mostBytes int) int {
	stats, err := os.Stat(path)
	if mostBytes <= 0 || err != nil || stats.Size() <= int64(mostBytes) {
		return 0
	}
	kept, err := readEnd(path, mostBytes/2)
	if err != nil {
		return 0
	}
	file, err := os.OpenFile(path, os.O_WRONLY|os.O_TRUNC|os.O_APPEND, 0o644)
	if err != nil {
		return 0
	}
	defer file.Close()
	_, _ = file.Write(append([]byte(cutLine), kept...))
	return int(stats.Size()) - len(kept) - len(cutLine)
}

// addCutBytes keeps how many bytes a part has lost to cuts, so a reader can find its place again.
func (folder Folder) addCutBytes(position, count int) {
	name := fmt.Sprintf("%d.%s", position, cutBytesSuffix)
	total, _ := folder.number(name)
	writeWhole(filepath.Join(folder.Path, name), strconv.Itoa(total+count))
}

// writeWhole writes a file by rename, so a reader never finds it empty or half written.
func writeWhole(path, text string) {
	if err := os.WriteFile(path+".new", []byte(text), 0o644); err == nil {
		_ = os.Rename(path+".new", path)
	}
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
	writeWhole(filepath.Join(folder.Path, "heartbeat"), time.Now().UTC().Format("2006-01-02T15:04:05.000000+00:00"))
}

func (folder Folder) number(name string) (int, bool) {
	text, err := os.ReadFile(filepath.Join(folder.Path, name))
	if err != nil {
		return 0, false
	}
	value, err := strconv.Atoi(strings.TrimSpace(string(text)))
	return value, err == nil
}
