package dockermock

import (
	"encoding/json"
	"slices"
	"strings"

	"journal-runner/recorded"
	"journal-runner/recording"
)

// runOutput is what one container of a recorded run_containers order printed, as the host answered the order.
type runOutput struct {
	Stdout string `json:"stdout"`
	Stderr string `json:"stderr"`
}

// runOutputs are the recorded outputs of the containers the journal ordered run, by the image and command each ran,
// in the order they were answered: a container that ran no driver program prints only what its run printed.
type runOutputs map[string][]runOutput

// runOutputsOf pairs each run of every recorded run_containers order with the output the host answered it with.
func runOutputsOf(scenario recorded.Scenario) (runOutputs, error) {
	calls, err := scenario.Calls(recording.WireHost)
	if err != nil {
		return nil, err
	}
	keys := map[string][]string{}
	outputs := runOutputs{}
	for _, call := range calls {
		if strings.HasSuffix(call.Answered.Path, "/host/instructions/claim") {
			for id, runKeys := range orderedRuns(decoded(call.Answered.Body)) {
				keys[id] = runKeys
			}
			continue
		}
		id := call.Asked.Path[strings.LastIndex(call.Asked.Path, "/")+1:]
		runKeys, isRun := keys[id]
		if !isRun {
			continue
		}
		var answer struct {
			Facts struct {
				Results []runOutput `json:"results"`
			} `json:"facts"`
		}
		if json.Unmarshal(decoded(call.Asked.Body), &answer) != nil {
			continue
		}
		for index, output := range answer.Facts.Results {
			if index < len(runKeys) {
				outputs[runKeys[index]] = append(outputs[runKeys[index]], output)
			}
		}
	}
	return outputs, nil
}

// orderedRuns are the keys of the runs of each run_containers order a claim handed out, by the order's id.
func orderedRuns(claim []byte) map[string][]string {
	var claimed struct {
		Instructions []struct {
			ID      string          `json:"id"`
			Type    string          `json:"type"`
			Payload json.RawMessage `json:"payload"`
		} `json:"instructions"`
	}
	_ = json.Unmarshal(claim, &claimed)
	runs := map[string][]string{}
	for _, instruction := range claimed.Instructions {
		if instruction.Type != "run_containers" {
			continue
		}
		payload := instruction.Payload
		var text string
		if json.Unmarshal(payload, &text) == nil {
			payload = json.RawMessage(text)
		}
		var plan struct {
			Runs []struct {
				Command  []string `json:"command"`
				Manifest struct {
					Image      string   `json:"image"`
					Entrypoint []string `json:"entrypoint"`
				} `json:"manifest"`
			} `json:"runs"`
		}
		if json.Unmarshal(payload, &plan) != nil {
			continue
		}
		for _, run := range plan.Runs {
			command := append(slices.Clone(run.Manifest.Entrypoint), run.Command...)
			runs[instruction.ID] = append(runs[instruction.ID], runKey(run.Manifest.Image, command))
		}
	}
	return runs
}

// runKey names a run by the image and the whole command it ran; an image is named with or without its digest's
// algorithm, as an order and a create name it.
func runKey(image string, command []string) string {
	return strings.TrimPrefix(image, "sha256:") + "\x00" + strings.Join(command, "\x00")
}

// take is the next recorded output of a run of the image and command, none when every one was played.
func (outputs runOutputs) take(key string) (runOutput, bool) {
	queue := outputs[key]
	if len(queue) == 0 {
		return runOutput{}, false
	}
	outputs[key] = queue[1:]
	return queue[0], true
}
