package hostapi

import (
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
