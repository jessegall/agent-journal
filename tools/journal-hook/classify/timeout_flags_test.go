package classify

import "testing"

func TestSavedTimeoutFlagsStayOutOfCommandArguments(t *testing.T) {
	for _, sample := range []struct{ arguments, wanted, selection, timeout string }{
		{"--timeout 5m cart", "cart", "", "5m"},
		{"--timeout=2h", "", "", "2h"},
		{"--tail 20 --timeout 5m cart", "cart", "tail:20", "5m"},
		{"--timeout 5m --tail 20 -- --timeout 2m", "--timeout 2m", "tail:20", "5m"},
		{"-- --timeout 5m", "-- --timeout 5m", "", ""},
		{"--timeout '5m'", "", "", "5m"},
		{"--timeout later", "", "", "later"},
		{"--timeout 0s", "", "", "0s"},
	} {
		t.Run(sample.arguments, func(t *testing.T) {
			options := splitSavedOptions(sample.arguments)
			if options.arguments != sample.wanted || options.selection != sample.selection || (sample.timeout != "" && (options.timeoutDuration == nil || *options.timeoutDuration != sample.timeout)) || (sample.timeout == "" && options.timeoutDuration != nil) {
				t.Fatalf("saved options %+v", options)
			}
		})
	}
}

func TestSavedTimeoutReachesThePreparedPart(t *testing.T) {
	classifier := NewClassifier(LoadTable(""))
	classifier.aliasLines = map[string]string{"bounded": "make build {args}"}
	classifier.savedCommands = []string{"bounded"}
	classifier.savedCommandsKnown = true
	prepared := classifier.Line("journal bounded --tail 20 --timeout 5m cart")
	if prepared.ParseError != "" || prepared.Line != "make build cart" || len(prepared.Parts) != 1 {
		t.Fatalf("prepared line %+v", prepared)
	}
	part := prepared.Parts[0]
	if part.TimeoutDuration == nil || *part.TimeoutDuration != "5m" || part.ReadFlag != "tail:20" || part.SavedCommand != "bounded" {
		t.Fatalf("prepared part %+v", part)
	}
}

func TestSavedTimeoutWithoutAValueReachesValidation(t *testing.T) {
	for _, arguments := range []string{"--timeout", "--timeout ''", "--timeout=\"\""} {
		options := splitSavedOptions(arguments)
		if options.arguments != "" || options.timeoutDuration == nil || *options.timeoutDuration != "" {
			t.Fatalf("saved options %+v", options)
		}
	}
}
