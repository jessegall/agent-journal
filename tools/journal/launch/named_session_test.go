package launch

import "testing"

func TestANamedSessionIsResumedAndNotHandedOnTwice(t *testing.T) {
	request := Request{ProgramArguments: []string{"--model", "opus", "--resume", "7083dde2", "--verbose"}}
	if got := request.NamedSession(); got != "7083dde2" {
		t.Fatalf("named session %q", got)
	}
	kept := request.ArgumentsBesideSession()
	if len(kept) != 3 || kept[0] != "--model" || kept[1] != "opus" || kept[2] != "--verbose" {
		t.Fatalf("kept %v", kept)
	}
}

func TestANamedSessionWithAnEqualsSignIsResumed(t *testing.T) {
	request := Request{ProgramArguments: []string{"--resume=abc"}}
	if got := request.NamedSession(); got != "abc" || len(request.ArgumentsBesideSession()) != 0 {
		t.Fatalf("named %q kept %v", got, request.ArgumentsBesideSession())
	}
}

func TestNoNamedSessionLetsTheMenuAsk(t *testing.T) {
	if got := (Request{ProgramArguments: []string{"--model", "opus"}}).NamedSession(); got != "" {
		t.Fatalf("named %q", got)
	}
}
