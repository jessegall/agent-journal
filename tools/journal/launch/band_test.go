package launch

import (
	"bytes"
	"strings"
	"testing"
)

const testLink = "http://127.0.0.1:8420/?key=secret-key&environment=shop"

func testBand() (*Band, *bytes.Buffer) {
	screen := &bytes.Buffer{}
	return NewBand(screen, BandLabels{Project: "shop", Environment: "main", Address: DisplayAddress(testLink)}), screen
}

func TestTheViewerAddressInTheBandHoldsNoKey(t *testing.T) {
	band, screen := testBand()
	band.Begin(30, 80)
	_, _ = band.Write([]byte("\x1b[2Jhello"))
	if strings.Contains(screen.String(), "secret-key") || strings.Contains(screen.String(), "key=") {
		t.Fatalf("the screen shows the key: %q", screen.String())
	}
	if !strings.Contains(screen.String(), "http://127.0.0.1:8420/?environment=shop") {
		t.Fatalf("the screen lacks the address: %q", screen.String())
	}
}

func TestTheBandIsDrawnOnTheBottomRowAndTheProgramGetsTheRowsAboveIt(t *testing.T) {
	band, screen := testBand()
	band.Begin(30, 80)
	for _, wanted := range []string{"\x1b[30;1H" + eraseLineCode + bandStyle, "shop · main", "\x1b[1;29r"} {
		if !strings.Contains(screen.String(), wanted) {
			t.Fatalf("the band lacks %q: %q", wanted, screen.String())
		}
	}
	if band.AgentRows() != 29 {
		t.Fatalf("the program has %d rows, not 29", band.AgentRows())
	}
}

func TestTheScrollRegionStartsAtTheTopRowSoScrolledLinesStayInTheScrollback(t *testing.T) {
	band, screen := testBand()
	band.Begin(30, 80)
	if strings.Contains(screen.String(), "\x1b[2;") || !strings.Contains(screen.String(), "\x1b[1;29r") {
		t.Fatalf("the scroll region does not start at the top row: %q", screen.String())
	}
	if strings.Contains(screen.String(), "\x1b[3J") {
		t.Fatalf("the band clears the scrollback: %q", screen.String())
	}
}

func TestTheBandIsAsLongAsItsWordsAndFillsNoMoreOfTheLine(t *testing.T) {
	band, _ := testBand()
	band.Begin(30, 120)
	line := band.line()
	if strings.Contains(line, "\x1b[K") || !strings.HasSuffix(line, " shop · main  http://127.0.0.1:8420/?environment=shop "+resetCode) {
		t.Fatalf("the band line is %q", line)
	}
}

func TestAWordTooWideForTheBandIsCutToTheTerminalsWidth(t *testing.T) {
	band, _ := testBand()
	band.Begin(30, 12)
	if line := band.line(); !strings.HasSuffix(line, " shop · main "+resetCode) && !strings.HasSuffix(line, " shop · main"+resetCode) {
		t.Fatalf("the band line is %q", line)
	}
}

func TestAClearOfTheScreenNeverLeavesTheBandWiped(t *testing.T) {
	band, screen := testBand()
	band.Begin(30, 80)
	screen.Reset()
	_, _ = band.Write([]byte("\x1b[2Jhello"))
	shown := screen.String()
	if !strings.HasPrefix(shown, "\x1b[2Jhello") || !strings.HasSuffix(shown, "\x1b7\x1b[1;29r"+band.line()+"\x1b8") {
		t.Fatalf("the band was not drawn again after the clear: %q", shown)
	}
}

func TestAMoveToTheTopAndPlainOutputPassThroughTheBandUntouched(t *testing.T) {
	band, screen := testBand()
	band.Begin(30, 80)
	screen.Reset()
	if _, err := band.Write([]byte("plain \x1b[1mbold\x1b[0m\x1b[H\r\n")); err != nil || screen.String() != "plain \x1b[1mbold\x1b[0m\x1b[H\r\n" {
		t.Fatalf("the screen got %q, %v", screen.String(), err)
	}
}

func TestAResizeErasesTheOldBandRowAndClearsNothingElse(t *testing.T) {
	band, screen := testBand()
	band.Begin(30, 80)
	screen.Reset()
	band.Begin(40, 100)
	shown := screen.String()
	if strings.Contains(shown, clearScreenCode) || !strings.Contains(shown, "\x1b7\x1b[30;1H"+eraseLineCode+"\x1b8") || !strings.Contains(shown, "\x1b[40;1H") || !strings.Contains(shown, "\x1b[1;39r") {
		t.Fatalf("the screen got %q", shown)
	}
}

func TestEndingTheBandGivesTheWholeScreenBack(t *testing.T) {
	band, screen := testBand()
	band.Begin(30, 80)
	screen.Reset()
	band.End()
	if screen.String() != "\x1b[r\x1b[2J\x1b[H" {
		t.Fatalf("the screen got %q", screen.String())
	}
}
