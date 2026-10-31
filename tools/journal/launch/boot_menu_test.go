package launch

import (
	"strings"
	"testing"
)

func codingProject() *fakeJournal {
	return &fakeJournal{suites: []string{"coding"}, environments: []Environment{{Name: "main", Folder: "/work/shop", Branch: "main", Suite: "coding"}}}
}

func TestOneInstalledSuiteSkipsTheSuiteQuestion(t *testing.T) {
	terminal := keys(enterPress, enterPress, enterPress)
	choice, err := Boot(codingProject(), terminal, Request{Program: "claude", Root: "/work/shop"})
	if err != nil || choice.Suite != "coding" || choice.Environment != "main" {
		t.Fatalf("the launch chose %+v, %v", choice, err)
	}
	if strings.Contains(terminal.screenText(), SuiteQuestion) {
		t.Fatalf("the suite question was asked with one suite installed:\n%s", terminal.screenText())
	}
}

func TestTwoInstalledSuitesAskWhichOne(t *testing.T) {
	journal := codingProject()
	journal.suites = []string{"coding", "marketing"}
	journal.environments = append(journal.environments, Environment{Name: "brand", Folder: "/work/shop", Branch: "main", Suite: "marketing"})
	terminal := keys(downPress, enterPress, enterPress, enterPress, enterPress)
	choice, err := Boot(journal, terminal, Request{Program: "claude", Root: "/work/shop"})
	if err != nil || choice.Suite != "marketing" || choice.Environment != "brand" {
		t.Fatalf("the launch chose %+v, %v", choice, err)
	}
	if !strings.Contains(terminal.screenText(), SuiteQuestion) {
		t.Fatalf("the suite question was not asked:\n%s", terminal.screenText())
	}
}

func TestAnotherSuitesEnvironmentsAreNeverOffered(t *testing.T) {
	journal := codingProject()
	journal.suites = []string{"coding", "marketing"}
	journal.environments = append(journal.environments, Environment{Name: "brand", Folder: "/work/shop", Branch: "main", Suite: "marketing"})
	terminal := keys(enterPress, enterPress, enterPress, enterPress)
	if _, err := Boot(journal, terminal, Request{Program: "claude", Root: "/work/shop"}); err != nil {
		t.Fatal(err)
	}
	if strings.Contains(terminal.screenText(), "brand") {
		t.Fatalf("an environment of the marketing suite was offered for coding:\n%s", terminal.screenText())
	}
}

func TestANewEnvironmentAsksItsNameAndBranchAndIsMadeInTheChosenSuite(t *testing.T) {
	journal := codingProject()
	presses := append([]Press{downPress, enterPress}, textPresses("checkout")...)
	presses = append(presses, textPresses("version-5")...)
	terminal := keys(append(presses, enterPress, enterPress)...)
	choice, err := Boot(journal, terminal, Request{Program: "claude", Root: "/work/shop"})
	if err != nil || choice.Environment != "checkout" {
		t.Fatalf("the launch chose %+v, %v", choice, err)
	}
	created := Environment{Name: "checkout", Folder: "/work/shop", Branch: "version-5", Suite: "coding"}
	if len(journal.created) != 1 || journal.created[0] != created {
		t.Fatalf("the journal was asked to make %+v, not %+v", journal.created, created)
	}
	if !strings.Contains(terminal.screenText(), NameQuestion) || !strings.Contains(terminal.screenText(), BranchQuestion) {
		t.Fatalf("the new environment's name and branch were not asked:\n%s", terminal.screenText())
	}
}

func TestAWorkersConversationIsNeverOffered(t *testing.T) {
	journal := codingProject()
	journal.conversations = []Conversation{{Session: "w-1", Role: "worker"}, {Session: "s-1", Role: "main"}}
	terminal := keys(enterPress, enterPress, enterPress)
	choice, err := Boot(journal, terminal, Request{Program: "claude", Root: "/work/shop"})
	if err != nil || choice.Session != "s-1" {
		t.Fatalf("the launch chose %+v, %v", choice, err)
	}
	if strings.Contains(terminal.screenText(), "w-1") {
		t.Fatalf("a worker's conversation was offered:\n%s", terminal.screenText())
	}
}

func TestTheLeftArrowGoesBackToTheLastQuestion(t *testing.T) {
	journal := codingProject()
	journal.suites = []string{"coding", "marketing"}
	journal.environments = append(journal.environments, Environment{Name: "brand", Folder: "/work/shop", Branch: "main", Suite: "marketing"})
	terminal := keys(enterPress, backPress, downPress, enterPress, enterPress, enterPress, enterPress)
	choice, err := Boot(journal, terminal, Request{Program: "claude", Root: "/work/shop"})
	if err != nil || choice.Suite != "marketing" || choice.Environment != "brand" {
		t.Fatalf("the launch chose %+v, %v", choice, err)
	}
}
