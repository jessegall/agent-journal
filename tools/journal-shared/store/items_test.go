package store

import (
	"errors"
	"sync"
	"testing"
)

func docKind() Kind {
	kind, _ := KindByName("doc")
	return kind
}

func TestOnlyOneOfManySimultaneousUpdatesOfTheSameVersionWins(t *testing.T) {
	opened := openIn(t, t.TempDir())
	ada, _ := opened.AddUser("Ada", RoleAdmin)
	caller := Caller{User: ada}
	item, err := opened.CreateItem(docKind(), Fields{"title": "T", "abstract": "A", "body": "start"}, caller)
	if err != nil {
		t.Fatal(err)
	}
	const writers = 12
	var group sync.WaitGroup
	results := make([]Item, writers)
	failures := make([]error, writers)
	for index := range writers {
		group.Add(1)
		go func() {
			defer group.Done()
			results[index], failures[index] = opened.UpdateItem(docKind(), item.ID, 1, Fields{"body": string(rune('a' + index))}, caller)
		}()
	}
	group.Wait()
	won := 0
	for index := range writers {
		if failures[index] == nil {
			won++
			if results[index].Version != 2 {
				t.Errorf("a winner was answered version %d", results[index].Version)
			}
			continue
		}
		if !errors.Is(failures[index], ErrStale) || results[index].Version != 2 {
			t.Errorf("a loser got %v with version %d", failures[index], results[index].Version)
		}
	}
	if won != 1 {
		t.Errorf("%d updates won", won)
	}
	if count := countOf(t, opened, "SELECT count(*) FROM item_versions WHERE kind = 'doc' AND item_id = 1"); count != 2 {
		t.Errorf("%d history rows", count)
	}
}

func TestEveryWriteAddsAHistoryRowNamingTheUserAndTheToken(t *testing.T) {
	opened := openIn(t, t.TempDir())
	ada, _ := opened.AddUser("Ada", RoleAdmin)
	_, token, _ := opened.NewToken(ada.ID, "laptop")
	caller := Caller{User: ada, TokenID: token.ID}
	item, _ := opened.CreateItem(docKind(), Fields{"title": "T", "abstract": "A", "body": "one"}, caller)
	opened.UpdateItem(docKind(), item.ID, 1, Fields{"body": "two"}, caller)
	if count := countOf(t, opened, "SELECT count(*) FROM item_versions WHERE user_id = 1 AND token_id = 1 AND fields LIKE '%two%'"); count != 1 {
		t.Errorf("the update is not in the history: %d", count)
	}
	if count := countOf(t, opened, "SELECT count(*) FROM item_versions WHERE action = 'create' AND version = 1"); count != 1 {
		t.Errorf("the create is not in the history: %d", count)
	}
}

func TestAnUpdateOfAnItemTheTableLacksIsNotFound(t *testing.T) {
	opened := openIn(t, t.TempDir())
	ada, _ := opened.AddUser("Ada", RoleAdmin)
	if _, err := opened.UpdateItem(docKind(), 9, 1, Fields{"body": "x"}, Caller{User: ada}); !errors.Is(err, ErrNotFound) {
		t.Errorf("%v", err)
	}
}

func TestAnUpdateOfARemovedItemIsRefusedAsRemoved(t *testing.T) {
	opened := openIn(t, t.TempDir())
	ada, _ := opened.AddUser("Ada", RoleAdmin)
	item, _ := opened.CreateItem(docKind(), Fields{"title": "T", "abstract": "A", "body": "one"}, Caller{User: ada})
	opened.DB.Exec("UPDATE docs SET removed_at = '2026-11-04T00:00:00Z' WHERE id = ?", item.ID)
	if _, err := opened.UpdateItem(docKind(), item.ID, 1, Fields{"body": "x"}, Caller{User: ada}); !errors.Is(err, ErrRemoved) {
		t.Errorf("%v", err)
	}
}

func TestAnExcerptShowsTheTextAroundTheTermCutWithDots(t *testing.T) {
	text := "A long opening that goes on before the Release word and then continues for a good while after it too"
	got := excerptAround("release", []string{"nothing here", text})
	want := "…ening that goes on before the Release word and then continues for a…"
	if got != want {
		t.Errorf("%q", got)
	}
	if excerptAround("absent", []string{text}) != "" {
		t.Error("an excerpt for a term that is not there")
	}
}
