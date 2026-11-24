package screen

import (
	"errors"
	"hash/fnv"
	"io"
	"strings"
	"sync"

	"github.com/charmbracelet/x/vt"

	"journal-agent/screen/contracts"
)

// EmulatorReader reads the screen through the charmbracelet vt emulator, which keeps partial escape and UTF-8
// sequences across feeds and gives wide and combined characters their real cell widths. Each region is found anew
// after every feed and its text hashed; its generation goes up only when its text changes, so a spinner redrawn
// beside a menu, or a region drawn a row lower, leaves the region's generation as it was. One lock guards the
// emulator, which has none of its own, so one goroutine may feed while others read.
type EmulatorReader struct {
	lock          sync.Mutex
	terminal      *vt.Emulator
	limits        Limits
	cursorVisible bool
	regions       []contracts.Region
	hashes        map[string]uint64
	generations   map[string]uint64
	version       uint64
	feedRefused   bool
	resizeRefused bool
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
	reader.lock.Lock()
	defer reader.lock.Unlock()

	if err := reader.limits.checkChunk(len(bytes)); err != nil {
		reader.feedRefused = true
		return err
	}

	written, err := reader.terminal.Write(bytes)
	if written > 0 {
		reader.version++
	}
	if err != nil {
		reader.feedRefused = true
		return err
	}
	reader.feedRefused = false
	reader.countGenerations()

	return nil
}

func (reader *EmulatorReader) Resize(columns, rows int) error {
	reader.lock.Lock()
	defer reader.lock.Unlock()

	if err := reader.limits.checkSize(columns, rows); err != nil {
		reader.resizeRefused = true
		return err
	}

	reader.resizeRefused = false
	reader.terminal.Resize(columns, rows)
	reader.version++
	reader.countGenerations()

	return nil
}

// Adopt takes the screen of a fresh reader in place of its own, discarding its own emulator and scrollback: the
// fresh reader's parser saw only output since it was made. Its version and generations go on rising, so nobody
// mistakes the adopted screen for the old one.
func (reader *EmulatorReader) Adopt(fresh *EmulatorReader) {
	fresh.lock.Lock()
	terminal, visible := fresh.terminal, fresh.cursorVisible
	fresh.lock.Unlock()

	reader.lock.Lock()
	defer reader.lock.Unlock()

	reader.terminal, reader.cursorVisible = terminal, visible
	terminal.SetCallbacks(vt.Callbacks{CursorVisibility: func(visible bool) { reader.cursorVisible = visible }})
	reader.feedRefused, reader.resizeRefused = false, false
	reader.version++
	reader.countGenerations()
}

func (reader *EmulatorReader) Snapshot() contracts.Snapshot {
	reader.lock.Lock()
	defer reader.lock.Unlock()

	return reader.snapshot()
}

// snapshot reads the screen; the caller holds the lock.
func (reader *EmulatorReader) snapshot() contracts.Snapshot {
	columns, height := reader.terminal.Width(), reader.terminal.Height()
	rows := make([]string, height)

	for row := range height {
		rows[row] = reader.rowText(row, columns)
	}

	cursor := reader.terminal.CursorPosition()

	return contracts.Snapshot{
		Rows:    rows,
		Cursor:  contracts.Cursor{Row: cursor.Y, Column: cursor.X, IsVisible: reader.cursorVisible},
		Buffer:  reader.buffer(),
		Columns: columns,
		Height:  height,
	}
}

// rowText is one screen row as text, without its trailing spaces: an empty cell is a space, and the second cell of
// a wide character adds nothing. The caller holds the lock.
func (reader *EmulatorReader) rowText(row, columns int) string {
	var line strings.Builder
	for column := range columns {
		cell := reader.terminal.CellAt(column, row)
		switch {
		case cell == nil:
			line.WriteByte(' ')
		case cell.Content != "":
			line.WriteString(cell.Content)
		case cell.Width != 0:
			line.WriteByte(' ')
		}
	}
	return strings.TrimRight(line.String(), " ")
}

// buffer names the screen buffer shown; the caller holds the lock.
func (reader *EmulatorReader) buffer() contracts.Buffer {
	if reader.terminal.IsAltScreen() {
		return contracts.AlternateBuffer
	}

	return contracts.NormalBuffer
}

func (reader *EmulatorReader) Generation(region string) uint64 {
	reader.lock.Lock()
	defer reader.lock.Unlock()

	return reader.generations[region]
}

// Unreadable says whether the screen shown may be wrong: the last feed failed, until a good feed, or the last resize
// was refused, so the grid keeps a size the program no longer draws at, until a good resize.
func (reader *EmulatorReader) Unreadable() bool {
	reader.lock.Lock()
	defer reader.lock.Unlock()

	return reader.feedRefused || reader.resizeRefused
}

// Version goes up with every feed that wrote bytes and every resize, so a watcher can tell cheaply that the screen
// may have changed since it last read it.
func (reader *EmulatorReader) Version() uint64 {
	reader.lock.Lock()
	defer reader.lock.Unlock()

	return reader.version
}

func (reader *EmulatorReader) ScreenGeneration() uint64 {
	reader.lock.Lock()
	defer reader.lock.Unlock()

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
	snapshot := reader.snapshot()
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
