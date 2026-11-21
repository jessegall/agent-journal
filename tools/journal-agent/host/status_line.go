package host

import (
	"encoding/json"
	"errors"
	"io"
	"log"
	"net"
	"os"
	"sync"
	"time"

	"journal-agent/client"
)

// StatusLineLimits is the part of Claude Code's status-line input the journal reads: the five-hour and seven-day
// windows, each with its used percent, already from 0 to 100, and its reset in Unix seconds. Nothing else of the input
// is decoded, kept or passed on.
type StatusLineLimits struct {
	RateLimits struct {
		FiveHour *statusLineWindow `json:"five_hour,omitempty"`
		SevenDay *statusLineWindow `json:"seven_day,omitempty"`
	} `json:"rate_limits"`
}

// statusLineWindow keeps an explicit zero apart from a missing value.
type statusLineWindow struct {
	UsedPercentage *json.Number `json:"used_percentage,omitempty"`
	ResetsAt       *int64       `json:"resets_at,omitempty"`
}

// mostStatusLineBytes bounds what the reader reads of the status-line input and what the relay reads of one record.
const mostStatusLineBytes = 64 * 1024

// ReadStatusLineLimits decodes the windows of one bounded status-line input; an input it cannot read has none.
func ReadStatusLineLimits(input []byte) StatusLineLimits {
	var limits StatusLineLimits
	if json.Unmarshal(input, &limits) != nil {
		return StatusLineLimits{}
	}
	return limits
}

// Readings are the windows with a used percent from 0 to 100; a window missing or out of range gives none.
func (limits StatusLineLimits) Readings() []WindowReading {
	windows := []struct {
		slot   string
		window *statusLineWindow
	}{
		{client.WindowFiveHour, limits.RateLimits.FiveHour},
		{client.WindowSevenDay, limits.RateLimits.SevenDay},
	}
	var readings []WindowReading
	for _, each := range windows {
		reading, ok := each.window.reading(each.slot)
		if !ok {
			continue
		}
		readings = append(readings, reading)
	}
	return readings
}

func (window *statusLineWindow) reading(slot string) (WindowReading, bool) {
	if window == nil || window.UsedPercentage == nil {
		return WindowReading{}, false
	}
	percent, err := window.UsedPercentage.Float64()
	if err != nil || percent < 0 || percent > 100 {
		return WindowReading{}, false
	}
	reading := WindowReading{LimitID: "claude", Slot: slot, UsedPercent: &percent}
	if window.ResetsAt != nil {
		reset := time.Unix(*window.ResetsAt, 0).UTC()
		reading.ResetsAt = &reset
	}
	return reading, true
}

// WindowObserver takes the limit windows a start's program reported.
type WindowObserver interface {
	Window(reading WindowReading)
}

// StatusLineRelays keeps one owner-only socket per running start, where that start's status-line reader hands the
// windows it read; a start opened again replaces its socket.
type StatusLineRelays struct {
	mutex     sync.Mutex
	listeners map[string]net.Listener
}

// Open listens at the start's socket and hands each window a record names to the observer.
func (relays *StatusLineRelays) Open(runtimeID, path string, observer WindowObserver) error {
	relays.mutex.Lock()
	defer relays.mutex.Unlock()
	if previous, open := relays.listeners[runtimeID]; open {
		previous.Close()
	}
	_ = os.Remove(path)
	listener, err := net.Listen("unix", path)
	if err != nil {
		return err
	}
	if err := os.Chmod(path, secretFileMode); err != nil {
		listener.Close()
		return err
	}
	if relays.listeners == nil {
		relays.listeners = map[string]net.Listener{}
	}
	relays.listeners[runtimeID] = listener
	go serveStatusLine(listener, observer)
	return nil
}

func serveStatusLine(listener net.Listener, observer WindowObserver) {
	for {
		connection, err := listener.Accept()
		if errors.Is(err, net.ErrClosed) {
			return
		}
		if err != nil {
			log.Printf("the status-line relay stopped: %v", err)
			return
		}
		go relayStatusLine(connection, observer)
	}
}

func relayStatusLine(connection net.Conn, observer WindowObserver) {
	defer connection.Close()
	_ = connection.SetReadDeadline(time.Now().Add(2 * time.Second))
	record, err := io.ReadAll(io.LimitReader(connection, mostStatusLineBytes))
	if err != nil {
		return
	}
	for _, reading := range ReadStatusLineLimits(record).Readings() {
		observer.Window(reading)
	}
}
