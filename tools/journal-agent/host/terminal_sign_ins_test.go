package host

import (
	"errors"
	"strings"
	"testing"
)

func TestTwoTerminalsOfOneFolderKeepTheirOwnSignIns(t *testing.T) {
	state := ConnectionState{Folder: t.TempDir(), CanonicalRoot: "/work/shop"}
	shellA, shellB := strings.Repeat("a", 32), strings.Repeat("b", 32)
	for _, signIn := range []TerminalSignIn{
		{Selector: shellA, Reference: "TS-AAAAAAAA", Generation: 1, Grant: "grant-a"},
		{Selector: shellB, Reference: "TS-BBBBBBBB", Generation: 2, Grant: "grant-b"},
	} {
		if err := state.SaveSignIn(signIn); err != nil {
			t.Fatal(err)
		}
	}

	if err := state.ClearSignIn(shellA, 1); err != nil {
		t.Fatal(err)
	}

	if _, err := state.SignIn(shellA); !errors.Is(err, ErrNoSignIn) {
		t.Fatalf("the revoked terminal kept its sign-in: %v", err)
	}
	if kept, err := state.SignIn(shellB); err != nil || kept.Grant != "grant-b" {
		t.Fatalf("the other terminal lost its sign-in: %+v, %v", kept, err)
	}
}

func TestALateRefusalOfAnOldGenerationLeavesTheSignInThatReplacedIt(t *testing.T) {
	state := ConnectionState{Folder: t.TempDir(), CanonicalRoot: "/work/shop"}
	shell := strings.Repeat("c", 32)
	renewed := TerminalSignIn{Selector: shell, Reference: "TS-CCCCCCC2", Generation: 3, Grant: "grant-new"}
	if err := state.SaveSignIn(renewed); err != nil {
		t.Fatal(err)
	}

	if err := state.ClearSignIn(shell, 2); err != nil {
		t.Fatal(err)
	}

	if kept, err := state.SignIn(shell); err != nil || kept.Grant != "grant-new" {
		t.Fatalf("a refusal of generation 2 erased generation 3: %+v, %v", kept, err)
	}
	resumed, err := state.SignInOf("TS-CCCCCCC2")
	if err != nil || resumed.Selector != shell {
		t.Fatalf("the sign-in was not found by its reference: %+v, %v", resumed, err)
	}
}

func TestASelectorThatIsNoLookupKeyIsRefused(t *testing.T) {
	state := ConnectionState{Folder: t.TempDir(), CanonicalRoot: "/work/shop"}

	if _, err := state.SignIn("../../binding"); !errors.Is(err, ErrSelectorMalformed) {
		t.Fatalf("a path as a selector answered %v", err)
	}
}
