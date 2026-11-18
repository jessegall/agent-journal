package screen

import (
	"hash/fnv"
	"io"
	"strings"

	"github.com/charmbracelet/x/vt"

	"journal-agent/screen/contracts"
)

// EmulatorReader reads the screen through the charmbracelet vt emulator, which keeps partial escape and UTF-8
// sequences across feeds and gives wide and combined characters their real cell widths. Regions are named row ranges
// whose text is hashed after each feed; a region's generation goes up when its text changes.
type EmulatorReader struct {
	terminal      *vt.Emulator
	limits        Limits
	cursorVisible bool
	regions       map[string][2]int
	hashes        map[string]uint64
	generations   map[string]uint64
}

var _ contracts.ScreenReader = (*EmulatorReader)(nil)

// NewEmulatorReader starts an empty screen of the given size with the named regions, each a [first, last) row range.
func NewEmulatorReader(columns, rows int, limits Limits, regions map[string][2]int) (*EmulatorReader, error) {
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
	}
	reader.terminal.SetCallbacks(vt.Callbacks{CursorVisibility: func(visible bool) { reader.cursorVisible = visible }})

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

// countGenerations raises the generation of each region whose text changed since the last count.
func (reader *EmulatorReader) countGenerations() {
	snapshot := reader.Snapshot()

	for name, bounds := range reader.regions {
		hash := fnv.New64a()
		for row := bounds[0]; row < bounds[1] && row < len(snapshot.Rows); row++ {
			hash.Write([]byte(snapshot.Rows[row]))
			hash.Write([]byte{'\n'})
		}

		if sum := hash.Sum64(); sum != reader.hashes[name] {
			reader.hashes[name] = sum
			reader.generations[name]++
		}
	}
}
