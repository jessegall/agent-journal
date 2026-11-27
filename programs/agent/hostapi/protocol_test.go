package hostapi

import (
	"context"
	"reflect"
	"slices"
	"strings"
	"testing"
)

// Each plan field protocol/host.json refuses in a contained plan is a field of the plan, and a contained plan that
// sets it is refused by its name.
func TestAContainedPlanThatNamesAHostFieldIsRefusedByItsName(t *testing.T) {
	plan := reflect.TypeOf(OpenPlan{})
	for _, name := range ContainedRefusedFields {
		index := slices.IndexFunc(reflect.VisibleFields(plan), func(field reflect.StructField) bool {
			return strings.Split(field.Tag.Get("json"), ",")[0] == name
		})
		if index < 0 {
			t.Fatalf("the protocol refuses %s, which a plan does not have", name)
		}
		named := OpenPlan{}
		reflect.ValueOf(&named).Elem().Field(index).Set(reflect.ValueOf([]string{"x"}))

		if got := hostThingsNamed(named); !slices.Equal(got, []string{name}) {
			t.Fatalf("a contained plan setting %s is refused for %v", name, got)
		}
	}
}

// A contained plan carries its start grant whole or not at all: one that carries part of it is refused naming each
// variable it misses, and one with none of it or all of it is taken.
func TestAContainedPlanCarryingPartOfItsStartGrantIsRefusedNamingWhatItMisses(t *testing.T) {
	whole := []string{}
	for _, name := range ContainedStartGrantEnvironment {
		whole = append(whole, name+"=x")
	}
	cases := map[string]struct {
		environment []string
		missing     []string
	}{
		"none":    {[]string{"TERM=xterm"}, nil},
		"whole":   {whole, nil},
		"partial": {[]string{"JOURNAL_START_TOKEN=x", "JOURNAL_PROFILE=p"}, []string{"JOURNAL_URL", "JOURNAL_PROFILE_REVISION"}},
	}
	for name, known := range cases {
		if got := missingGrantVariables(known.environment); !slices.Equal(got, known.missing) {
			t.Errorf("a plan carrying %s of its grant misses %v, not %v", name, got, known.missing)
		}
	}
}

// A plan the journal records with its raw bytes names raw_bytes, which the strict reader takes.
func TestAPlanWithRawBytesIsRead(t *testing.T) {
	payload := `{"type":"pipe","restart":"never","argv":["sh"],"restart_argv":[],"restart_when_file":null,"environment":[],` +
		`"folder":"/w","container":null,"labels":null,"size":{"columns":80,"rows":24},"files":[],"folders":[],"inherit":[],` +
		`"side_sockets":[],"raw_bytes":true}`
	plan, err := DecodePayload[OpenPlan](Order{Type: "open_process", Payload: payload})
	if err != nil || !plan.RawBytes {
		t.Fatalf("a plan with raw_bytes was answered %v, %v", plan.RawBytes, err)
	}
	if _, err := DecodePayload[OpenPlan](Order{Type: "open_process", Payload: strings.Replace(payload, `"raw_bytes"`, `"raw_bites"`, 1)}); err == nil {
		t.Fatal("a plan with a field the protocol does not know was read")
	}
}

// A contained plan's files are filled without the host's names, so a {host:NAME} in one is refused as unsafe.
func TestAContainedPlanFileNamingAHostNameIsRefused(t *testing.T) {
	placeholders := Placeholders{Folders: map[string]string{filesFolderName: "/files"}}
	for _, name := range HostNames {
		_, err := placeholders.Fill("{host:" + name + "}")
		refusal, isRefusal := err.(RefusalError)
		if !isRefusal || refusal.Refusal != Unsafe {
			t.Fatalf("a contained plan naming {host:%s} was not refused as unsafe: %v", name, err)
		}
	}
}

// An order's payload is read strictly: a field the protocol does not know, a missing field and a value of the wrong
// type are each refused as unsafe, naming the field and the order type.
func TestAnOrderPayloadIsReadStrictly(t *testing.T) {
	cases := map[string]string{
		`{"columns":80,"rows":24,"colour":"red"}`: `the payload of resize holds the field "colour", which the protocol does not know`,
		`{"columns":80}`:               `the payload of resize misses its field rows`,
		`{"columns":"wide","rows":24}`: `the payload of resize holds columns as string, not uint16`,
	}
	for payload, reason := range cases {
		_, err := DecodePayload[TerminalSize](Order{Type: "resize", Payload: payload})
		refusal, isRefusal := err.(RefusalError)
		if !isRefusal || refusal.Refusal != Unsafe || refusal.Reason != reason {
			t.Errorf("the payload %s was answered %v, not %q", payload, err, reason)
		}
	}
	if size, err := DecodePayload[TerminalSize](Order{Type: "resize", Payload: `{"columns":80,"rows":24}`}); err != nil || size.Rows != 24 {
		t.Fatalf("a whole payload did not read: %v %v", size, err)
	}
}

// The generated dispatch reads every order through its type and Validate: a field missing deep inside the payload and
// an enum value the protocol does not know are refused as unsafe by their path, before the handler is called.
func TestTheDispatchRefusesANestedMissingFieldAndAnUnknownValueByTheirPath(t *testing.T) {
	plan := func(processType, size string) string {
		return `{"type":"` + processType + `","restart":"","argv":["sh"],"restart_argv":[],"restart_when_file":null,` +
			`"environment":[],"folder":"/","container":null,"labels":null,"size":` + size + `,"files":[],` +
			`"folders":[],"inherit":[],"side_sockets":[]}`
	}
	cases := map[string]string{
		plan("terminal", `{"columns":80}`):         `the payload of open_process misses its field size.rows`,
		plan("window", `{"columns":80,"rows":24}`): `the payload of open_process type holds "window", which host protocol 1 does not know`,
	}
	for payload, reason := range cases {
		_, err := carry(testOrders{}, "open_process")(context.Background(), Order{Type: "open_process", Payload: payload})
		refusal, isRefusal := err.(RefusalError)
		if !isRefusal || refusal.Refusal != Unsafe || refusal.Reason != reason {
			t.Errorf("the payload %s was answered %v, not %q", payload, err, reason)
		}
	}
}

// The record and stop_recording orders are gone from host protocol 1: the host carries neither, so one is refused as
// an order it does not know.
func TestTheHostRefusesTheRemovedRecordOrdersAsUnknown(t *testing.T) {
	executors := Executors(testOrders{})
	for _, removed := range []string{"record", "stop_recording"} {
		_, carried := executors[removed]
		_, known := OrderTypes[removed]
		if carried || known {
			t.Errorf("the host still knows the order %s", removed)
		}
	}
}
