package store

import (
	"errors"
	"strings"
	"testing"
	"time"
)

func TestATokenIsKeptOnlyAsItsDigestInEveryTable(t *testing.T) {
	opened := openIn(t, t.TempDir())
	user, _ := opened.AddUser("Ada", RoleAdmin)
	text, _, err := opened.NewToken(user.ID, "laptop")
	if err != nil || !strings.HasPrefix(text, TokenPrefix) {
		t.Fatalf("%q, %v", text, err)
	}
	for _, table := range []string{"server", "users", "tokens", "docs", "sequences", "checks", "item_versions"} {
		for _, column := range columnsOf(t, opened, table) {
			query := "SELECT count(*) FROM " + table + " WHERE CAST(" + column + " AS TEXT) LIKE '%" + text + "%'"
			if countOf(t, opened, query) != 0 {
				t.Errorf("the token text is in %s.%s", table, column)
			}
		}
	}
}

func TestARevokedTokenIsRefusedAtOnce(t *testing.T) {
	opened := openIn(t, t.TempDir())
	user, _ := opened.AddUser("Ada", RoleAdmin)
	text, token, _ := opened.NewToken(user.ID, "")
	if _, err := opened.Authenticate(text); err != nil {
		t.Fatal(err)
	}
	if _, err := opened.RevokeToken(token.ID); err != nil {
		t.Fatal(err)
	}
	if _, err := opened.Authenticate(text); !errors.Is(err, ErrNotAuthenticated) {
		t.Fatalf("%v", err)
	}
}

func TestAWrongTokenIsRefusedAndNothingLimitsTheTries(t *testing.T) {
	opened := openIn(t, t.TempDir())
	user, _ := opened.AddUser("Ada", RoleAdmin)
	text, _, _ := opened.NewToken(user.ID, "")
	for range 50 {
		if _, err := opened.Authenticate("jsl_wrong"); !errors.Is(err, ErrNotAuthenticated) {
			t.Fatalf("%v", err)
		}
	}
	if _, err := opened.Authenticate(text); err != nil {
		t.Fatalf("the right token is refused after wrong ones: %v", err)
	}
}

func TestLastUsedIsWrittenAtMostOnceAMinute(t *testing.T) {
	opened := openIn(t, t.TempDir())
	clock := time.Date(2026, 11, 4, 12, 0, 0, 0, time.UTC)
	opened.CurrentTime = func() time.Time { return clock }
	user, _ := opened.AddUser("Ada", RoleAdmin)
	text, token, _ := opened.NewToken(user.ID, "")
	lastUsed := func() string {
		current, err := opened.Token(token.ID)
		if err != nil {
			t.Fatal(err)
		}
		return current.LastUsedAt
	}
	opened.Authenticate(text)
	first := lastUsed()
	clock = clock.Add(30 * time.Second)
	opened.Authenticate(text)
	if lastUsed() != first {
		t.Errorf("written again after 30 seconds: %s", lastUsed())
	}
	clock = clock.Add(31 * time.Second)
	opened.Authenticate(text)
	if lastUsed() == first {
		t.Error("not written after a minute")
	}
}

func TestRemovingAUserRevokesTheirTokensAndKeepsTheName(t *testing.T) {
	opened := openIn(t, t.TempDir())
	user, _ := opened.AddUser("Grace", RoleEdit)
	text, token, _ := opened.NewToken(user.ID, "")
	if _, err := opened.RemoveUser(user.ID); err != nil {
		t.Fatal(err)
	}
	if _, err := opened.Authenticate(text); !errors.Is(err, ErrNotAuthenticated) {
		t.Errorf("%v", err)
	}
	if current, _ := opened.Token(token.ID); current.RevokedAt == "" {
		t.Error("the token is not marked revoked")
	}
	if _, err := opened.AddUser("Grace", RoleRead); !errors.Is(err, ErrNameTaken) {
		t.Errorf("%v", err)
	}
	if _, err := opened.UserByName("Grace"); !errors.Is(err, ErrNotFound) {
		t.Errorf("%v", err)
	}
}

func TestARoleIsOneOfThreeAndEachAllowsWhatTheLowerOnesDo(t *testing.T) {
	if _, err := ParseRole("boss"); !errors.Is(err, ErrBadRole) {
		t.Errorf("%v", err)
	}
	if !RoleAdmin.Allows(RoleEdit) || !RoleEdit.Allows(RoleRead) || RoleRead.Allows(RoleEdit) || RoleEdit.Allows(RoleAdmin) {
		t.Error("the roles are not ordered admin, edit, read")
	}
}
