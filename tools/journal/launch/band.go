package launch

import (
	"fmt"
	"io"
	"os"
	"regexp"
	"strings"
	"sync"
	"unicode/utf8"
)

const (
	bandStyle        = "\x1b[48;5;24m\x1b[38;5;255m\x1b[1m"
	clearScreenCode  = "\x1b[2J"
	homeCode         = "\x1b[H"
	secondRowHome    = "\x1b[2;1H"
	secondRowCleared = "\x1b[2;1H\x1b[J"
)

// screenDisturbance is what a program may print that would move or wipe the band's row or its scroll region.
var screenDisturbance = regexp.MustCompile(`\x1b\[[0-9;]*r|\x1b\[[0-3]?J|\x1b\[(?:1|0)?(?:;[0-9]*)?H|\x1bc`)

// ShowsBand says whether the person sits at a terminal that can hold the band: both what they type and what they see.
func ShowsBand() bool {
	return isTerminal(os.Stdin) && isTerminal(os.Stdout)
}

// BandLabels are the three words of the band: one at the start, one in the middle and one at the end.
type BandLabels struct {
	Start, Middle, End string
}

// Band is the one line always at the top of the person's terminal. The program has the rows under it, as a scroll
// region, and a screen clear or a move to the top of the screen it prints never reaches the line.
type Band struct {
	screen  io.Writer
	labels  BandLabels
	mutex   sync.Mutex
	rows    int
	columns int
}

// NewBand makes a band that draws on the writer.
func NewBand(screen io.Writer, labels BandLabels) *Band {
	return &Band{screen: screen, labels: labels, rows: 24, columns: 80}
}

// Begin clears the screen, draws the band and gives the program every row under it.
func (band *Band) Begin(rows, columns int) {
	band.mutex.Lock()
	defer band.mutex.Unlock()
	band.rows, band.columns = rows, columns
	_, _ = io.WriteString(band.screen, clearScreenCode+"\x1b[3J"+band.line()+band.region()+secondRowHome)
}

// End gives the whole screen back and clears it.
func (band *Band) End() {
	band.mutex.Lock()
	defer band.mutex.Unlock()
	_, _ = io.WriteString(band.screen, "\x1b[r"+clearScreenCode+homeCode)
}

// AgentRows is how many rows the program has: every row but the band's.
func (band *Band) AgentRows() int {
	band.mutex.Lock()
	defer band.mutex.Unlock()
	return max(band.rows-1, 1)
}

// Write shows what the program printed, with a clear of the whole screen and a move to the top turned into the second
// row, and the band drawn again after anything that could have wiped it.
func (band *Band) Write(data []byte) (int, error) {
	band.mutex.Lock()
	defer band.mutex.Unlock()
	shown := strings.NewReplacer(clearScreenCode, secondRowCleared, homeCode, secondRowHome).Replace(string(data))
	if screenDisturbance.Match(data) {
		shown += "\x1b7" + band.region() + band.line() + "\x1b8"
	}
	_, err := io.WriteString(band.screen, shown)
	return len(data), err
}

// region is the code that gives the program every row under the band.
func (band *Band) region() string {
	return fmt.Sprintf("\x1b[2;%dr", band.rows)
}

func (band *Band) line() string {
	start, middle, end := band.labels.Start, band.labels.Middle, band.labels.End
	middleWidth := band.columns - utf8.RuneCountInString(start) - utf8.RuneCountInString(end)
	return homeCode + bandStyle + "\x1b[K" + cut(start+centre(middle, middleWidth)+end, band.columns) + resetCode
}

// cut keeps the first width characters of the text.
func cut(text string, width int) string {
	characters := []rune(text)
	if len(characters) <= max(width, 0) {
		return text
	}
	return string(characters[:max(width, 0)])
}

// centre pads the text with spaces on both sides to the width, the odd space on the right; a text too wide is cut.
func centre(text string, width int) string {
	spare := width - utf8.RuneCountInString(text)
	if spare < 0 {
		return cut(text, width)
	}
	return strings.Repeat(" ", spare/2) + text + strings.Repeat(" ", spare-spare/2)
}
