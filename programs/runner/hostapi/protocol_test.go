package hostapi

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"path/filepath"
	"reflect"
	"strings"
	"testing"

	"journal-runner/host"
	"journal-runner/recorded"
	"journal-runner/recording"
)

// A plan the journal records with its raw bytes names raw_bytes, which the strict reader takes.
func TestAPlanWithRawBytesIsRead(t *testing.T) {
	payload := `{"type":"pipe","restart":"never","argv":["sh"],"restart_argv":[],"restart_when_file":null,"environment":[],` +
		`"folder":"/w","container":null,"size":{"columns":80,"rows":24},"files":[],"folders":[],"inherit":[],` +
		`"side_sockets":[],"raw_bytes":true}`
	plan, err := DecodePayload[OpenPlan](Instruction{Type: "open_process", Payload: payload})
	if err != nil || !plan.RawBytes {
		t.Fatalf("a plan with raw_bytes was answered %v, %v", plan.RawBytes, err)
	}
	if _, err := DecodePayload[OpenPlan](Instruction{Type: "open_process", Payload: strings.Replace(payload, `"raw_bytes"`, `"raw_bites"`, 1)}); err == nil {
		t.Fatal("a plan with a field the protocol does not know was read")
	}
}

// An instruction's payload is read strictly: a field the protocol does not know, a missing field and a value of the wrong
// type are each refused as unsafe, naming the field and the instruction type.
func TestAnInstructionPayloadIsReadStrictly(t *testing.T) {
	cases := map[string]string{
		`{"columns":80,"rows":24,"colour":"red"}`: `the payload of resize holds the field "colour", which the protocol does not know`,
		`{"columns":80}`:               `the payload of resize misses its field rows`,
		`{"columns":"wide","rows":24}`: `the payload of resize holds columns as string, not uint16`,
	}
	for payload, reason := range cases {
		_, err := DecodePayload[TerminalSize](Instruction{Type: "resize", Payload: payload})
		refusal, isRefusal := err.(RefusalError)
		if !isRefusal || refusal.Refusal != Unsafe || refusal.Reason != reason {
			t.Errorf("the payload %s was answered %v, not %q", payload, err, reason)
		}
	}
	if size, err := DecodePayload[TerminalSize](Instruction{Type: "resize", Payload: `{"columns":80,"rows":24}`}); err != nil || size.Rows != 24 {
		t.Fatalf("a whole payload did not read: %v %v", size, err)
	}
}

// The dispatch reads every instruction strictly through its type: a field missing deep inside the payload is refused as
// unsafe by its path, before the handler is called.
func TestTheDispatchRefusesANestedMissingFieldByItsPath(t *testing.T) {
	plan := func(processType, size string) string {
		return `{"type":"` + processType + `","restart":"","argv":["sh"],"restart_argv":[],"restart_when_file":null,` +
			`"environment":[],"folder":"/","container":null,"size":` + size + `,"files":[],` +
			`"folders":[],"inherit":[],"side_sockets":[]}`
	}
	cases := map[string]string{
		plan("terminal", `{"columns":80}`): `the payload of open_process misses its field size.rows`,
	}
	for payload, reason := range cases {
		_, err := carry(testInstructions{}, "open_process")(context.Background(), Instruction{Type: "open_process", Payload: payload})
		refusal, isRefusal := err.(RefusalError)
		if !isRefusal || refusal.Refusal != Unsafe || refusal.Reason != reason {
			t.Errorf("the payload %s was answered %v, not %q", payload, err, reason)
		}
	}
}

// The record and stop_recording instructions are gone from host protocol 1: the host carries neither, so one is refused as
// an instruction it does not know.
func TestTheHostRefusesTheRemovedRecordInstructionsAsUnknown(t *testing.T) {
	executors := Executors(testInstructions{})
	for _, removed := range []string{"record", "stop_recording"} {
		_, carried := executors[removed]
		_, known := InstructionTypes[removed]
		if carried || known {
			t.Errorf("the host still knows the instruction %s", removed)
		}
	}
}

// A build_image payload, as the journal handed it out when the recorded Codex image was built again, is read strictly: an unknown, a missing and a mistyped
// field of it, a build argument's too, are each refused as unsafe by name.
func TestAnImageBuildIsReadStrictly(t *testing.T) {
	payload := recordedInstructions(t, "build_image")[0].Payload
	build, err := DecodePayload[host.ImageBuild](Instruction{Type: "build_image", Payload: payload})
	if err != nil || build.Dockerfile != "Dockerfile" || len(build.Context) == 0 || build.BuildArguments[0].Value != "0.172.0" {
		t.Fatalf("the recorded build was read as %+v, %v", build, err)
	}
	deadline := fmt.Sprintf(`"deadline_ms":%d`, build.DeadlineMs)
	cases := map[string]string{
		strings.Replace(payload, `"dockerfile"`, `"dockerfiles"`, 1):  `the payload of build_image holds the field "dockerfiles", which the protocol does not know`,
		strings.Replace(payload, `,"output_limit":65536`, ``, 1):      `the payload of build_image misses its field output_limit`,
		strings.Replace(payload, deadline, `"deadline_ms":"soon"`, 1): `the payload of build_image holds deadline_ms as string, not int`,
		strings.Replace(payload, `{"name":"VERSION",`, `{`, 1):        `the payload of build_image misses its field build_arguments.0.name`,
	}
	for changed, reason := range cases {
		_, err := DecodePayload[host.ImageBuild](Instruction{Type: "build_image", Payload: changed})
		refusal, isRefusal := err.(RefusalError)
		if !isRefusal || refusal.Refusal != Unsafe || refusal.Reason != reason {
			t.Errorf("the payload %s was answered %v, not %q", changed, err, reason)
		}
	}
}

// Every instruction any recording's host claimed reads strictly into the payload its handler takes, as the dispatch
// reads it: the recordings hold only what the protocol allows.
func TestEveryRecordedInstructionReadsStrictly(t *testing.T) {
	handlers := reflect.TypeOf((*InstructionHandlers)(nil)).Elem()
	read := 0
	for _, instruction := range everyRecordedInstruction(t) {
		method, isKnown := handlers.MethodByName(handlerNameOf(instruction.Type))
		if !isKnown {
			t.Errorf("a recording holds the instruction type %s, which no handler takes", instruction.Type)
			continue
		}
		into := any(&struct{}{})
		if method.Type.NumIn() == 3 {
			into = reflect.New(method.Type.In(2)).Interface()
		}
		if err := decodeStrictly([]byte(instruction.Payload), into); err != nil {
			t.Errorf("the recorded %s %s does not read: %v", instruction.Type, instruction.ID, err)
		}
		read++
	}
	if read == 0 {
		t.Fatal("no recording holds an instruction")
	}
}

// everyRecordedInstruction is each instruction a claim answered in any scenario recorded so far.
func everyRecordedInstruction(t *testing.T) []Instruction {
	t.Helper()
	root, err := recorded.Root()
	if err != nil {
		t.Fatal(err)
	}
	definitions, _ := filepath.Glob(filepath.Join(root, "resources/recordings/scenarios/*/*.json"))
	instructions := []Instruction{}
	for _, definition := range definitions {
		driver := filepath.Base(filepath.Dir(definition))
		scenario, err := recorded.Load(root, driver, strings.TrimSuffix(filepath.Base(definition), ".json"))
		if err != nil {
			continue
		}
		calls, _ := scenario.Calls(recording.WireHost)
		for _, call := range calls {
			if call.Answered.Path != "/host/instructions/claim" {
				continue
			}
			body, _ := base64.StdEncoding.DecodeString(call.Answered.Body)
			var claim struct {
				Instructions []Instruction `json:"instructions"`
			}
			_ = json.Unmarshal(body, &claim)
			instructions = append(instructions, claim.Instructions...)
		}
	}
	return instructions
}

// handlerNameOf is the handler method an instruction type is carried out by: open_container is OpenContainer.
func handlerNameOf(instructionType string) string {
	words := strings.Split(instructionType, "_")
	for index, word := range words {
		words[index] = strings.ToUpper(word[:1]) + word[1:]
	}
	return strings.Join(words, "")
}
