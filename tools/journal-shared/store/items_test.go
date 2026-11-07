package store

import (
	"errors"
	"sync"
	"testing"
)

func docKind() ItemType {
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
	actual := excerptAround("release", []string{"nothing here", text})
	want := "…ening that goes on before the Release word and then continues for a…"
	if actual != want {
		t.Errorf("%q", actual)
	}
	if excerptAround("absent", []string{text}) != "" {
		t.Error("an excerpt for a term that is not there")
	}
}

func TestAPurgeDeletesTheItemAndItsVersionsAddsOnePurgeRowAndNeverFreesTheNumber(t *testing.T) {
	opened := openIn(t, t.TempDir())
	ada, _ := opened.AddUser("Ada", RoleAdmin)
	caller := Caller{User: ada}
	first, _ := opened.CreateItem(docKind(), Fields{"title": "T", "abstract": "A", "body": "one"}, caller)
	opened.UpdateItem(docKind(), first.ID, 1, Fields{"body": "two"}, caller)
	deleted, err := opened.PurgeItem(docKind(), first.ID, caller)
	if err != nil || deleted != 2 {
		t.Fatalf("%d, %v", deleted, err)
	}
	if _, err := opened.ReadItem(docKind(), first.ID); !errors.Is(err, ErrNotFound) {
		t.Errorf("the purged item is still there: %v", err)
	}
	versions, err := opened.ItemVersions(docKind(), first.ID)
	if err != nil || len(versions) != 1 || versions[0].Action != ActionPurge {
		t.Fatalf("%v, %v", versions, err)
	}
	if count := countOf(t, opened, "SELECT count(*) FROM item_versions WHERE action = 'purge' AND fields = '{}'"); count != 1 {
		t.Errorf("%d purge rows with empty fields", count)
	}
	if count := countOf(t, opened, "SELECT count(*) FROM item_versions WHERE fields LIKE '%two%' OR fields LIKE '%one%'"); count != 0 {
		t.Errorf("the text of the purged item is still in the history")
	}
	second, _ := opened.CreateItem(docKind(), Fields{"title": "T", "abstract": "A", "body": "new"}, caller)
	if second.ID == first.ID {
		t.Errorf("the number %d was used twice", second.ID)
	}
	if _, err := opened.PurgeItem(docKind(), first.ID, caller); !errors.Is(err, ErrNotFound) {
		t.Errorf("a purged item was purged again: %v", err)
	}
}

func TestRemovingAndRestoringEachAddAVersionAndAnItemAlreadyInThatStateStaysAsItIs(t *testing.T) {
	opened := openIn(t, t.TempDir())
	ada, _ := opened.AddUser("Ada", RoleAdmin)
	caller := Caller{User: ada}
	item, _ := opened.CreateItem(docKind(), Fields{"title": "T", "abstract": "A", "body": "one"}, caller)
	restoredItem, _ := opened.RestoreItem(docKind(), item.ID, caller)
	removed, _ := opened.RemoveItem(docKind(), item.ID, caller)
	removedItem, _ := opened.RemoveItem(docKind(), item.ID, caller)
	restored, _ := opened.RestoreItem(docKind(), item.ID, caller)
	if restoredItem.Version != 1 || removed.Version != 2 || removedItem.Version != 2 || restored.Version != 3 || restored.RemovedAt != "" {
		t.Errorf("%d %d %d %d %q", restoredItem.Version, removed.Version, removedItem.Version, restored.Version, restored.RemovedAt)
	}
	if count := countOf(t, opened, "SELECT count(*) FROM item_versions WHERE action IN ('remove', 'restore')"); count != 2 {
		t.Errorf("%d history rows for removing and restoring", count)
	}
}
