package client

import (
	"encoding/json"
	"strings"
	"sync"
	"time"
)

// failedCallsHeader carries the calls that failed on the host's side since the journal last answered, on the next
// call it answers, so the journal learns of failures it never saw.
const failedCallsHeader = "X-Journal-Failed-Calls"

// failedCallLimit is the most failed calls the host keeps for its next report; older ones go first.
const failedCallLimit = 20

// FailedCall is one call the journal did not answer: its route, the status it got (0 for no answer at all), the
// reason, and when it first failed this way.
type FailedCall struct {
	Route  string    `json:"route"`
	Status int       `json:"status"`
	Reason string    `json:"reason"`
	Since  time.Time `json:"since"`
}

// failedCalls keeps the calls that failed since the journal last answered, one entry for each route and status.
type failedCalls struct {
	mutex sync.Mutex
	calls []FailedCall
}

// note keeps a failed call; a route that keeps failing the same way keeps the time it first failed.
func (failed *failedCalls) note(target string, status int, reason string, at time.Time) {
	route, _, _ := strings.Cut(target, "?")
	failed.mutex.Lock()
	defer failed.mutex.Unlock()
	for index, call := range failed.calls {
		if call.Route == route && call.Status == status {
			failed.calls[index].Reason = reason
			return
		}
	}
	failed.calls = append(failed.calls, FailedCall{Route: route, Status: status, Reason: reason, Since: at})
	if len(failed.calls) > failedCallLimit {
		failed.calls = failed.calls[len(failed.calls)-failedCallLimit:]
	}
}

// pending is the header value of the calls kept so far, and how many it holds; empty when none failed.
func (failed *failedCalls) pending() (string, int) {
	failed.mutex.Lock()
	defer failed.mutex.Unlock()
	if len(failed.calls) == 0 {
		return "", 0
	}
	encoded, err := json.Marshal(failed.calls)
	if err != nil {
		return "", 0
	}

	return string(encoded), len(failed.calls)
}

// forget drops the first calls, once a call that carried them was answered.
func (failed *failedCalls) forget(count int) {
	failed.mutex.Lock()
	defer failed.mutex.Unlock()
	failed.calls = failed.calls[min(count, len(failed.calls)):]
}
