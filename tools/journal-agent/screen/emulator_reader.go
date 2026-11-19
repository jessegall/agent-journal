package screen

import (
	"errors"
	"hash/fnv"
	"io"
	"strings"

	"github.com/charmbracelet/x/vt"

	"journal-agent/screen/contracts"
)

// EmulatorReader reads the screen through the charmbracelet vt emulator, which keeps partial escape and UTF-8
// sequences across feeds and gives wide and combined characters their real cell widths. Each region is found anew
// after every feed and its text hashed; its generation goes up only when its text changes, so a spinner redrawn
// beside a menu, or a region drawn a row lower, leaves the region's generation as it was.
type EmulatorReader struct {
	terminal      *vt.Emulator
	limits        Limits
	cursorVisible bool
	regions       []contracts.Region
	hashes        map[string]uint64
	generations   map[string]uint64
	// volatile are the regions the whole-screen generation leaves out.
	volatile         []contracts.Region
	screenHash       uint64
	screenGeneration uint64
}

var _ contracts.ScreenReader = (*EmulatorReader)(nil)

// NewEmulatorReader starts an empty screen of the given size that counts the generations of the regions, and of the
// whole screen.
func NewEmulatorReader(columns, rows int, limits Limits, regions []contracts.Region) (*EmulatorReader, error) {
	return newEmulatorReader(columns, rows, limits, regions, nil)
}

// NewReader starts an empty screen of the given size for a program drawn this way: it counts the generations of
// every region the layout names, and of the whole screen without the layout's other regions, such as its spinner
// and status line.
func (layout Layout) NewReader(columns, rows int, limits Limits) (*EmulatorReader, error) {
	return newEmulatorReader(columns, rows, limits, layout.Regions(), layout.Others)
}

func newEmulatorReader(
	columns, rows int,
	limits Limits,
	regions []contracts.Region,
	volatile []contracts.Region,
) (*EmulatorReader, error) {
	if err := limits.checkSize(columns, rows); err != nil {
		return nil, err
	}

	reader := &EmulatorReader{
		terminal:      vt.NewEmulator(columns, rows),
		limits:        limits,
		cursorVisible: true,
		regions:       regions,
		hashes:        map[string]uint64{},
		generations:   map[string]uint64{},
		volatile:      volatile,
	}
	reader.terminal.SetCallbacks(vt.Callbacks{CursorVisibility: func(visible bool) { reader.cursorVisible = visible }})
	reader.terminal.SetScrollbackSize(limits.MaxScrollbackLines)

	// The emulator answers terminal queries on its own pipe; the reader never sends them on, but must drain them.
	go io.Copy(io.Discard, reader.terminal)
	reader.countGenerations()

	return reader, nil
}

func (reader *EmulatorReader) Feed(bytes []byte) error {
	if err := reader.limits.checkChunk(len(bytes)); err != nil {
		return err
	}

	if _, err := reader.terminal.Write(bytes); err != nil {
		return err
	}
	reader.countGenerations()

	return nil
}

func (reader *EmulatorReader) Resize(columns, rows int) error {
	if err := reader.limits.checkSize(columns, rows); err != nil {
		return err
	}

	reader.terminal.Resize(columns, rows)
	reader.countGenerations()

	return nil
}

func (reader *EmulatorReader) Snapshot() contracts.Snapshot {
	columns, height := reader.terminal.Width(), reader.terminal.Height()
	rows := make([]string, height)

	for row := range height {
		var line strings.Builder
		for column := 0; column < columns; column++ {
			cell := reader.terminal.CellAt(column, row)
			if cell == nil || cell.Content == "" {
				if cell == nil || cell.Width != 0 {
					line.WriteByte(' ')
				}
				continue
			}
			line.WriteString(cell.Content)
		}
		rows[row] = strings.TrimRight(line.String(), " ")
	}

	cursor := reader.terminal.CursorPosition()
	buffer := contracts.NormalBuffer
	if reader.terminal.IsAltScreen() {
		buffer = contracts.AlternateBuffer
	}

	return contracts.Snapshot{
		Rows:    rows,
		Cursor:  contracts.Cursor{Row: cursor.Y, Column: cursor.X, Visible: reader.cursorVisible},
		Buffer:  buffer,
		Columns: columns,
		Height:  height,
	}
}

func (reader *EmulatorReader) Generation(region string) uint64 {
	return reader.generations[region]
}

func (reader *EmulatorReader) ScreenGeneration() uint64 {
	return reader.screenGeneration
}

// Follow feeds every chunk the program writes into the reader until the source ends, calling afterChunk once each
// chunk is read, so a live terminal is read as it is drawn. The source's end is not an error.
func (reader *EmulatorReader) Follow(source io.Reader, afterChunk func()) error {
	chunk := make([]byte, min(followChunkBytes, reader.limits.MaxChunkBytes))

	for {
		count, err := source.Read(chunk)
		if count > 0 {
			if feedErr := reader.Feed(chunk[:count]); feedErr != nil {
				return feedErr
			}
			afterChunk()
		}
		if errors.Is(err, io.EOF) {
			return nil
		}
		if err != nil {
			return err
		}
	}
}

// followChunkBytes is how much Follow reads from the program at most in one go.
const followChunkBytes = 32 << 10

// countGenerations raises the generation of each region whose text changed since the last count; a region that is
// not drawn counts as its own text, so it changes when it appears or goes.
func (reader *EmulatorReader) countGenerations() {
	snapshot := reader.Snapshot()
	reader.countScreenGeneration(snapshot)

	for _, region := range reader.regions {
		hash := fnv.New64a()
		if rows, found := region.Rows(snapshot); found {
			for row := rows.First; row < rows.Last && row < len(snapshot.Rows); row++ {
				hash.Write([]byte(snapshot.Rows[row]))
				hash.Write([]byte{'\n'})
			}
		} else {
			hash.Write([]byte{0})
		}

		name := region.Name()
		if sum := hash.Sum64(); sum != reader.hashes[name] {
			reader.hashes[name] = sum
			reader.generations[name]++
		}
	}
}

// countScreenGeneration raises the whole-screen generation when the text of any row outside the volatile regions
// changed since the last count.
func (reader *EmulatorReader) countScreenGeneration(snapshot contracts.Snapshot) {
	var volatileRows []contracts.RowRange
	for _, region := range reader.volatile {
		if rows, found := region.Rows(snapshot); found {
			volatileRows = append(volatileRows, rows)
		}
	}

	hash := fnv.New64a()
	for row, text := range snapshot.Rows {
		if !isInAny(row, volatileRows) {
			hash.Write([]byte(text))
		}
		hash.Write([]byte{'\n'})
	}
	if sum := hash.Sum64(); sum != reader.screenHash {
		reader.screenHash = sum
		reader.screenGeneration++
	}
}
