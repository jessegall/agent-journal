// Package hostapi is host protocol 1 on the host's side: the orders the journal signs, their check, the record of
// answers that keeps an order from running twice, and the dispatch that runs them in order per process.
package hostapi

import (
	"encoding/json"
	"time"
)

// Protocol is the version of the host protocol this binary speaks.
const Protocol = 1

// Order is one signed instruction of the journal: the host's whole vocabulary arrives as these.
type Order struct {
	ID        string          `json:"id"`
	Sequence  uint64          `json:"sequence"`
	Type      string          `json:"type"`
	ProcessID string          `json:"process_id"`
	Payload   json.RawMessage `json:"payload"`
	ExpiresAt time.Time       `json:"expires_at"`
	Signature string          `json:"signature"`
}

// KeyWrite is the payload of write_keys: bytes guarded by the rows they were meant for and the input generation, or
// typed by the user and written at once.
type KeyWrite struct {
	Bytes             []byte    `json:"bytes"`
	IfRows            *RowGuard `json:"if_rows"`
	IfInputGeneration *uint64   `json:"if_input_generation"`
	AsUser            bool      `json:"as_user"`
}

// RowGuard names the screen rows a write was meant for by the hash of their text.
type RowGuard struct {
	From int    `json:"from"`
	To   int    `json:"to"`
	Hash string `json:"hash"` // sha256 of the rows' text joined by newlines
}

// Status is how an order ended on the host.
type Status string

const (
	Done    Status = "done"
	Refused Status = "refused"
)

// Refusal is why the host did not carry out an order.
type Refusal string

const (
	GuardMoved    Refusal = "guard_moved"
	NotRunning    Refusal = "not_running"
	Expired       Refusal = "expired"
	Unsafe        Refusal = "unsafe"
	HostRestarted Refusal = "host_restarted"
	Fenced        Refusal = "fenced"
)

// Answer is what the host tells the journal of one order.
type Answer struct {
	OrderID string         `json:"order_id"`
	Status  Status         `json:"status"`
	Refusal Refusal        `json:"refusal,omitempty"`
	Facts   map[string]any `json:"facts,omitempty"`
}

// DoneWith is the answer of an order carried out, with the facts the journal reads from it.
func DoneWith(order Order, facts map[string]any) Answer {
	return Answer{OrderID: order.ID, Status: Done, Facts: facts}
}

// RefusedFor is the answer of an order the host did not carry out.
func RefusedFor(order Order, refusal Refusal, facts map[string]any) Answer {
	return Answer{OrderID: order.ID, Status: Refused, Refusal: refusal, Facts: facts}
}

// IsHostWide says whether the order is about the host as a whole, so it waits for no process's orders.
func (order Order) IsHostWide() bool {
	switch order.Type {
	case "upgrade", "remove", "allow_images", "make_folder", "remove_folder", "folder_use":
		return true
	}
	return order.ProcessID == ""
}
