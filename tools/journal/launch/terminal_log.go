package launch

import (
	"bufio"
	"os"
	"path/filepath"
	"regexp"
	"strconv"
	"strings"
	"sync"
)

// TerminalLineLimit is how many of its last terminal lines the log of one agent keeps.
const TerminalLineLimit = 2000

// escapeCodes are the terminal's colour and cursor sequences, left out of the lines the log keeps.
var escapeCodes = regexp.MustCompile(`\x1b\[[0-9;?]*[ -/]*[@-~]|\x1b\][^\x07\x1b]*(\x07|\x1b\\)|\x1b[@-Z\\-_]`)

// TerminalLog keeps an agent program's terminal output as numbered lines, "<number>\t<text>", in a file of its own,
// the last TerminalLineLimit of them.
type TerminalLog struct {
	path      string
	file      *os.File
	pending   []byte
	number    int
	lineCount int
	lock      sync.Mutex
}

// TerminalFile is the log file of one agent under the journal's runtime folder.
func TerminalFile(home string, agentID int) string {
	return filepath.Join(home, "runtime", "terminals", strconv.Itoa(agentID)+".log")
}

// OpenTerminalLog opens the agent's log, numbering on from its last line.
func OpenTerminalLog(path string) (*TerminalLog, error) {
	if err := os.MkdirAll(filepath.Dir(path), 0o700); err != nil {
		return nil, err
	}
	lines := readLines(path)
	file, err := os.OpenFile(path, os.O_CREATE|os.O_APPEND|os.O_WRONLY, 0o600)
	if err != nil {
		return nil, err
	}
	log := &TerminalLog{path: path, file: file, lineCount: len(lines)}
	if len(lines) > 0 {
		log.number, _ = strconv.Atoi(strings.SplitN(lines[len(lines)-1], "\t", 2)[0])
	}
	return log, nil
}

// Write takes the program's output as it comes and keeps each finished line.
func (log *TerminalLog) Write(output []byte) (int, error) {
	log.lock.Lock()
	defer log.lock.Unlock()
	log.pending = append(log.pending, output...)
	for {
		end := strings.IndexByte(string(log.pending), '\n')
		if end < 0 {
			return len(output), nil
		}
		if err := log.keep(string(log.pending[:end])); err != nil {
			return 0, err
		}
		log.pending = log.pending[end+1:]
	}
}

// Close keeps the last unfinished line and closes the file.
func (log *TerminalLog) Close() error {
	log.lock.Lock()
	defer log.lock.Unlock()
	if len(log.pending) > 0 {
		_ = log.keep(string(log.pending))
		log.pending = nil
	}
	if log.lineCount > TerminalLineLimit {
		_ = log.trimmed()
	}
	return log.file.Close()
}

func (log *TerminalLog) keep(raw string) error {
	text := escapeCodes.ReplaceAllString(raw, "")
	text = strings.TrimSuffix(text, "\r")
	if index := strings.LastIndexByte(text, '\r'); index >= 0 {
		text = text[index+1:]
	}
	log.number++
	if _, err := log.file.WriteString(strconv.Itoa(log.number) + "\t" + text + "\n"); err != nil {
		return err
	}
	log.lineCount++
	if log.lineCount >= 2*TerminalLineLimit {
		return log.trimmed()
	}
	return nil
}

func (log *TerminalLog) trimmed() error {
	lines := readLines(log.path)
	if len(lines) > TerminalLineLimit {
		lines = lines[len(lines)-TerminalLineLimit:]
	}
	if err := os.WriteFile(log.path, []byte(strings.Join(lines, "\n")+"\n"), 0o600); err != nil {
		return err
	}
	log.lineCount = len(lines)
	return nil
}

func readLines(path string) []string {
	file, err := os.Open(path)
	if err != nil {
		return nil
	}
	defer file.Close()
	lines := []string{}
	scanner := bufio.NewScanner(file)
	scanner.Buffer(make([]byte, 0, 64*1024), 1024*1024)
	for scanner.Scan() {
		lines = append(lines, scanner.Text())
	}
	return lines
}
