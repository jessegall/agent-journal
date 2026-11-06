package launch

import (
	"fmt"
	"io"
	"net/url"
	"os"
	"regexp"
	"strings"
	"sync"
)

const (
	bandStyle       = "\x1b[48;5;24m\x1b[38;5;255m\x1b[1m"
	clearScreenCode = "\x1b[2J"
	homeCode        = "\x1b[H"
	eraseLineCode   = "\x1b[2K"
)

// screenDisturbance is what a program may print that would wipe the band's row or change its scroll region.
var screenDisturbance = regexp.MustCompile(`\x1b\[[0-9;]*r|\x1b\[[0-3]?J|\x1bc`)

// ShowsBand says whether the person sits at a terminal that can hold the band: both what they type and what they see.
func ShowsBand() bool {
	return isTerminal(os.Stdin) && isTerminal(os.Stdout)
}

// BandLabels are the words of the band: the project, its environment and the address of the viewer, which holds no key.
type BandLabels struct {
	Project, Environment, Address string
}

// Text is the band's words in one line.
func (labels BandLabels) Text() string {
	return " " + strings.Join([]string{labels.Project + " · " + labels.Environment, labels.Address}, "  ") + " "
}

// DisplayAddress is the viewer link as it is shown: the link without the key that logs in.
func DisplayAddress(link string) string {
	address, err := url.Parse(link)
	if err != nil {
		return link
	}
	query := address.Query()
	query.Del("key")
	address.RawQuery = query.Encode()
	return address.String()
}

// HeaderBar is the line printed above the program when the screen is not a terminal that can hold the band.
func HeaderBar(environment string, agentID int, address string) string {
	return fmt.Sprintf("agent-journal · %s · agent %d · %s", environment, agentID, address)
}

// Band is the one line always at the bottom of the person's terminal, as long as its words and no longer. The program
// has the rows above it as a scroll region that starts at the top row, so what scrolls off the top stays in the
// terminal's scrollback, and a screen clear it prints never wipes the line for long.
type Band struct {
	screen  io.Writer
	labels  BandLabels
	mutex   sync.Mutex
	rows    int
	columns int
	drawn   bool
}

// NewBand makes a band that draws on the writer.
func NewBand(screen io.Writer, labels BandLabels) *Band {
	return &Band{screen: screen, labels: labels, rows: 24, columns: 80}
}

// Begin draws the band for the size of the terminal and gives the program every row above it. The first call clears the
// screen; a later one, after a resize, erases the row the band stood on and clears nothing else.
func (band *Band) Begin(rows, columns int) {
	band.mutex.Lock()
	defer band.mutex.Unlock()
	previous := band.rows
	band.rows, band.columns = rows, columns
	opening := clearScreenCode
	if band.drawn {
		opening = "\x1b7" + band.rowCode(previous) + eraseLineCode + "\x1b8"
	}
	band.drawn = true
	_, _ = io.WriteString(band.screen, opening+band.region()+band.line()+homeCode)
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

// Write shows what the program printed, and draws the band again after anything that could have wiped it.
func (band *Band) Write(data []byte) (int, error) {
	band.mutex.Lock()
	defer band.mutex.Unlock()
	shown := string(data)
	if screenDisturbance.Match(data) {
		shown += "\x1b7" + band.region() + band.line() + "\x1b8"
	}
	_, err := io.WriteString(band.screen, shown)
	return len(data), err
}

// region is the code that gives the program every row above the band.
func (band *Band) region() string {
	return fmt.Sprintf("\x1b[1;%dr", max(band.rows-1, 1))
}

func (band *Band) rowCode(row int) string {
	return fmt.Sprintf("\x1b[%d;1H", row)
}

func (band *Band) line() string {
	return band.rowCode(band.rows) + eraseLineCode + bandStyle + cut(band.labels.Text(), band.columns) + resetCode
}

// cut keeps the first width characters of the text.
func cut(text string, width int) string {
	characters := []rune(text)
	if len(characters) <= max(width, 0) {
		return text
	}
	return string(characters[:max(width, 0)])
}
