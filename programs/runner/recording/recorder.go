package recording

import "encoding/json"

// Wire is a wire between the journal and the outside whose calls a recording keeps, as the PHP App\Recordings\Enums\Wire.
type Wire string

// The wires a recording keeps.
const (
	WireHost   Wire = "host"
	WireHooks  Wire = "hooks"
	WireAgent  Wire = "agent"
	WireDocker Wire = "docker"
	WireDriver Wire = "driver"
)

// Opening is how a recorded exchange opened, the first line of its draft, as the PHP RecordingOpening writes it.
type Opening struct {
	Wire        Wire              `json:"wire"`
	Exchange    string            `json:"exchange"`
	Mode        string            `json:"mode"`
	Argv        []string          `json:"argv"`
	Environment map[string]string `json:"environment"`
	Inherited   []string          `json:"inherited"`
	Folder      string            `json:"folder"`
	Columns     int               `json:"columns"`
	Rows        int               `json:"rows"`
	Image       string            `json:"image"`
	OpenedAt    int64             `json:"openedAt"`
}

// Event is one line of a draft after its opening, as the PHP RecordedEvent writes it: typed, printed, resized,
// asked or answered, timed in microseconds since the epoch.
type Event struct {
	Type    string          `json:"type"`
	At      int64           `json:"at"`
	Bytes   string          `json:"bytes"`
	Stream  string          `json:"stream"`
	Secret  bool            `json:"secret"`
	Columns int             `json:"columns"`
	Rows    int             `json:"rows"`
	Call    json.RawMessage `json:"call"`
}

// Recorder keeps what crosses one wire while recording is on, an exchange at a time; the wire's tap calls nothing
// else.
type Recorder interface {
	Wire() Wire
	// Begin opens the exchange's draft, before anything crosses the wire.
	Begin(exchange string, opening Opening) error
	// Add adds what crossed: typed, printed, resized, asked or answered.
	Add(exchange string, event Event) error
	End(exchange string, exitCode int) error
}
