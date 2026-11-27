package recorded

import (
	"encoding/json"
	"fmt"
	"time"

	"journal-runner/recording"
)

// Call is one recorded call: what was asked and what was answered. A call asked before the recording run opened,
// such as a long poll already waiting, kept only its answer, which names its method and path too.
type Call struct {
	Exchange string
	Asked    recording.Call
	Answered recording.Call
	// Gap is how long the answer took after the asking, none for an answer whose asking was not kept.
	Gap time.Duration
}

// calls pairs each answer with the asking of the same method and path before it.
func (exchange Exchange) calls() ([]Call, error) {
	calls := []Call{}
	type asking struct {
		call recording.Call
		at   int64
	}
	waiting := []asking{}
	for _, event := range exchange.Events {
		if event.Type != "asked" && event.Type != "answered" {
			continue
		}
		var call recording.Call
		if err := json.Unmarshal(event.Call, &call); err != nil {
			return nil, fmt.Errorf("reading a call of exchange %s: %w", exchange.Name, err)
		}
		if event.Type == "asked" {
			waiting = append(waiting, asking{call, event.At})
			continue
		}
		paired := Call{Exchange: exchange.Name, Answered: call}
		for index, asked := range waiting {
			if asked.call.Method == call.Method && asked.call.Path == call.Path {
				paired.Asked = asked.call
				paired.Gap = time.Duration(event.At-asked.at) * time.Microsecond
				waiting = append(waiting[:index], waiting[index+1:]...)
				break
			}
		}
		calls = append(calls, paired)
	}
	return calls, nil
}
