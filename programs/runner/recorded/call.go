package recorded

import (
	"encoding/json"
	"fmt"
	"time"

	"journal-runner/recording"
)

// Call is one recorded call. The recording can open after its request or end before its reply.
type Call struct {
	Exchange string
	Asked    recording.Call
	Answered recording.Call
	// Gap is how long the answer took after the asking, none for an answer whose asking was not kept.
	Gap time.Duration
	// AskedAt is when the call was asked, in microseconds since the epoch as the recording keeps its moments; none
	// for an answer whose asking was not kept.
	AskedAt int64
}

// Request names the method and path even when the recording began after the request arrived.
func (call Call) Request() recording.Call {
	if call.Asked.Method != "" {
		return call.Asked
	}
	return call.Answered
}

// calls pairs each answer with the asking of the same method and path before it.
func (exchange Exchange) calls(includeUnanswered bool) ([]Call, error) {
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
				paired.AskedAt = asked.at
				waiting = append(waiting[:index], waiting[index+1:]...)
				break
			}
		}
		calls = append(calls, paired)
	}
	if includeUnanswered {
		for _, asked := range waiting {
			calls = append(calls, Call{Exchange: exchange.Name, Asked: asked.call, AskedAt: asked.at})
		}
	}
	return calls, nil
}
