package launch

import (
	"bytes"
	"strings"
	"testing"
)

func testBand() (*Band, *bytes.Buffer) {
	screen := &bytes.Buffer{}
	return NewBand(screen, BandLabels{Start: "agent-journal", Middle: "shop · main", End: "http://127.0.0.1:8420/"}), screen
}

func TestTheBandIsDrawnOnTheTopRowAndTheProgramGetsTheRowsUnderIt(t *testing.T) {
	band, screen := testBand()
	band.Begin(30, 80)
	for _, wanted := range []string{"\x1b[H" + bandStyle, "agent-journal", "shop · main", "http://127.0.0.1:8420/", "\x1b[2;30r", "\x1b[2;1H"} {
		if !strings.Contains(screen.String(), wanted) {
			t.Fatalf("the band lacks %q: %q", wanted, screen.String())
		}
	}
	if band.AgentRows() != 29 {
		t.Fatalf("the program has %d rows, not 29", band.AgentRows())
	}
}

func TestTheBandLineIsExactlyTheTerminalsWidthWithTheMiddleWordCentred(t *testing.T) {
	band, _ := testBand()
	band.Begin(30, 60)
	text := strings.TrimSuffix(strings.TrimPrefix(band.line(), "\x1b[H"+bandStyle+"\x1b[K"), resetCode)
	if len([]rune(text)) != 60 || !strings.HasPrefix(text, "agent-journal") || !strings.HasSuffix(text, "http://127.0.0.1:8420/") {
		t.Fatalf("the band line is %q", text)
	}
	if middle := strings.Index(text, "shop · main"); middle < 13 || middle+11 > 60-22 {
		t.Fatalf("the middle word stands at %d in %q", middle, text)
	}
}

func TestAWordTooWideForTheBandIsCutToTheTerminalsWidth(t *testing.T) {
	band, _ := testBand()
	band.Begin(30, 20)
	text := strings.TrimSuffix(strings.TrimPrefix(band.line(), "\x1b[H"+bandStyle+"\x1b[K"), resetCode)
	if text != "agent-journalhttp://" {
		t.Fatalf("the band line is %q", text)
	}
}

func TestAClearOfTheScreenAndAMoveToTheTopNeverReachTheBand(t *testing.T) {
	band, screen := testBand()
	band.Begin(30, 80)
	screen.Reset()
	_, _ = band.Write([]byte("\x1b[2Jhello\x1b[H"))
	shown := screen.String()
	if strings.Contains(shown, "\x1b[2J") || !strings.Contains(shown, "\x1b[2;1H\x1b[Jhello\x1b[2;1H") {
		t.Fatalf("the screen got %q", shown)
	}
	if !strings.HasSuffix(shown, "\x1b7\x1b[2;30r"+band.line()+"\x1b8") {
		t.Fatalf("the band was not drawn again after the clear: %q", shown)
	}
}

func TestPlainOutputPassesThroughTheBandUntouched(t *testing.T) {
	band, screen := testBand()
	band.Begin(30, 80)
	screen.Reset()
	if _, err := band.Write([]byte("plain \x1b[1mbold\x1b[0m\r\n")); err != nil || screen.String() != "plain \x1b[1mbold\x1b[0m\r\n" {
		t.Fatalf("the screen got %q, %v", screen.String(), err)
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
