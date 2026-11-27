package hostapi

import (
	"context"
	"strings"
	"testing"
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
