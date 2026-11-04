package web

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/jessegall/agent-journal/tools/journal-shared/store"
)

func stateFor(made fixture, role store.Role, previous string) *httptest.ResponseRecorder {
	var headers map[string]string
	if previous != "" {
		headers = map[string]string{"If-None-Match": previous}
	}
	return made.send("GET", "/state", "", made.tokens[role], headers)
}

func TestTheStateListsEveryItemWithItsVersionAndWhetherItIsRemoved(t *testing.T) {
	made := newFixture(t)
	createChecklist(t, made)
	made.send("POST", "/items/check", `{"fields": {"title": "Suite", "command": "true", "brief": "", "interval_minutes": 0}}`, made.tokens[store.RoleAdmin], nil)
	made.send("DELETE", "/items/doc/1", "", made.tokens[store.RoleAdmin], nil)
	response := stateFor(made, store.RoleRead, "")
	body := decode(t, response)
	items, _ := body["items"].([]any)
	if response.Code != 200 || body["role"] != "read" || len(items) != 2 || len(body["server_key"].(string)) != 8 {
		t.Fatalf("%d %s", response.Code, response.Body.String())
	}
	doc, check := items[0].(map[string]any), items[1].(map[string]any)
	if doc["kind"] != "doc" || doc["id"] != float64(1) || doc["version"] != float64(2) || doc["removed"] != true || check["kind"] != "check" || check["version"] != float64(1) || check["removed"] != false {
		t.Fatalf("%v", items)
	}
	if response.Header().Get("ETag") != `"`+body["etag"].(string)+`"` {
		t.Errorf("%s is not %v", response.Header().Get("ETag"), body["etag"])
	}
}

func TestTheServerKeyInStateIsTheOneInInfo(t *testing.T) {
	made := newFixture(t)
	info := httptest.NewRecorder()
	made.handler.ServeHTTP(info, httptest.NewRequest("GET", "/info", nil))
	if decode(t, info)["server_key"] != decode(t, stateFor(made, store.RoleRead, ""))["server_key"] {
		t.Error("the keys differ")
	}
}

func TestARoundWithNothingNewIs304WithNoBody(t *testing.T) {
	made := newFixture(t)
	createChecklist(t, made)
	tag := stateFor(made, store.RoleRead, "").Header().Get("ETag")
	again := stateFor(made, store.RoleRead, tag)
	if again.Code != http.StatusNotModified || again.Body.Len() != 0 || again.Header().Get("ETag") != tag {
		t.Fatalf("%d %q", again.Code, again.Body.String())
	}
}

func TestAWriteMovesTheEtag(t *testing.T) {
	made := newFixture(t)
	createChecklist(t, made)
	tag := stateFor(made, store.RoleRead, "").Header().Get("ETag")
	made.send("PUT", "/items/doc/1", `{"fields": {"body": "new"}}`, made.tokens[store.RoleEdit], ifMatch(`"1"`))
	after := stateFor(made, store.RoleRead, tag)
	if after.Code != 200 || after.Header().Get("ETag") == tag {
		t.Fatalf("%d %s", after.Code, after.Header().Get("ETag"))
	}
}

func TestARoleChangeMovesTheEtagOfThatUser(t *testing.T) {
	made := newFixture(t)
	tag := stateFor(made, store.RoleEdit, "").Header().Get("ETag")
	if made.send("PATCH", "/users/2", `{"role": "read"}`, made.tokens[store.RoleAdmin], nil).Code != 200 {
		t.Fatal("the role was not changed")
	}
	after := stateFor(made, store.RoleEdit, tag)
	if after.Code != 200 || decode(t, after)["role"] != "read" || after.Header().Get("ETag") == tag {
		t.Fatalf("%d %s", after.Code, after.Body.String())
	}
}

func TestAPurgeMovesTheEtagAndTheItemLeavesTheList(t *testing.T) {
	made := newFixture(t)
	createChecklist(t, made)
	tag := stateFor(made, store.RoleRead, "").Header().Get("ETag")
	ada, _ := made.store.UserByName("Ada")
	if _, err := made.store.PurgeItem(store.Kinds[0], 1, store.Caller{User: ada}); err != nil {
		t.Fatal(err)
	}
	after := stateFor(made, store.RoleRead, tag)
	items, _ := decode(t, after)["items"].([]any)
	if after.Code != 200 || after.Header().Get("ETag") == tag || len(items) != 0 {
		t.Fatalf("%d %s", after.Code, after.Body.String())
	}
}
