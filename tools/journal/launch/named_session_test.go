package launch

import "testing"

func TestANamedSessionIsResumedAndNotHandedOnTwice(t *testing.T) {
	request := Request{ProgramArguments: []string{"--model", "opus", "--resume", "7083dde2", "--verbose"}}
	if actual := request.NamedSession(); actual != "7083dde2" {
		t.Fatalf("named session %q", actual)
	}
	kept := request.ArgumentsBesideSession()
	if len(kept) != 3 || kept[0] != "--model" || kept[1] != "opus" || kept[2] != "--verbose" {
		t.Fatalf("kept %v", kept)
	}
}

func TestANamedSessionWithAnEqualsSignIsResumed(t *testing.T) {
	request := Request{ProgramArguments: []string{"--resume=abc"}}
	if actual := request.NamedSession(); actual != "abc" || len(request.ArgumentsBesideSession()) != 0 {
		t.Fatalf("named %q kept %v", actual, request.ArgumentsBesideSession())
	}
}

func TestNoNamedSessionLetsTheMenuAsk(t *testing.T) {
	if actual := (Request{ProgramArguments: []string{"--model", "opus"}}).NamedSession(); actual != "" {
		t.Fatalf("named %q", actual)
	}
}

func TestTheOpenMainAgentsConversationComesFirst(t *testing.T) {
	listed := []Conversation{{Session: "today"}, {Session: "october"}}
	titled := []Conversation{{Session: "october"}, {Session: "today"}}
	if actual := OpenFirst(titled, listed); actual[0].Session != "today" || actual[1].Session != "october" {
		t.Fatalf("order %v", actual)
	}
}
