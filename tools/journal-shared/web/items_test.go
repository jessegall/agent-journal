package web

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/jessegall/agent-journal/tools/journal-shared/store"
)

const checklist = `{"fields": {"title": "Release checklist", "abstract": "What to do before a release", "body": "Tag first."}}`

func decode(t *testing.T, response *httptest.ResponseRecorder) map[string]any {
	t.Helper()
	var body map[string]any
	if err := json.Unmarshal(response.Body.Bytes(), &body); err != nil {
		t.Fatalf("not JSON: %s", response.Body.String())
	}
	return body
}

func fieldsOf(body map[string]any) map[string]any {
	fields, _ := body["fields"].(map[string]any)
	return fields
}

func ifMatch(version string) map[string]string {
	return map[string]string{"If-Match": version}
}

func createChecklist(t *testing.T, made fixture) map[string]any {
	t.Helper()
	response := made.requestResponse("POST", "/items/doc", checklist, made.tokens[store.RoleAdmin], nil)
	if response.Code != http.StatusCreated {
		t.Fatalf("create: %d %s", response.Code, response.Body.String())
	}
	return decode(t, response)
}

func TestAnItemIsCreatedThenReadWithItsVersionAndEtag(t *testing.T) {
	made := newFixture(t)
	created := createChecklist(t, made)
	if created["version"] != float64(1) || created["creator"] != "Ada" || created["updated_by"] != "Ada" || created["kind"] != "doc" {
		t.Fatalf("%v", created)
	}
	read := made.requestResponse("GET", "/items/doc/1", "", made.tokens[store.RoleRead], nil)
	body := decode(t, read)
	if read.Code != 200 || read.Header().Get("ETag") != `"1"` || fieldsOf(body)["body"] != "Tag first." || fieldsOf(body)["title"] != "Release checklist" {
		t.Fatalf("%d %s %s", read.Code, read.Header().Get("ETag"), read.Body.String())
	}
}

func TestAnUpdateAnswersTheVersionItWroteAndNamesWhoWroteIt(t *testing.T) {
	made := newFixture(t)
	createChecklist(t, made)
	response := made.requestResponse("PUT", "/items/doc/1", `{"fields": {"body": "Tag first, then build."}}`, made.tokens[store.RoleEdit], ifMatch(`"1"`))
	body := decode(t, response)
	if response.Code != 200 || body["version"] != float64(2) || body["updated_by"] != "Grace" || body["creator"] != "Ada" || response.Header().Get("ETag") != `"2"` {
		t.Fatalf("%d %v", response.Code, body)
	}
	if fieldsOf(body)["body"] != "Tag first, then build." {
		t.Fatalf("%v", body)
	}
}

func TestAFieldLeftOutOfAnUpdateKeepsItsValue(t *testing.T) {
	made := newFixture(t)
	createChecklist(t, made)
	response := made.requestResponse("PUT", "/items/doc/1", `{"fields": {"title": "Release steps", "unknown_field": "ignored"}}`, made.tokens[store.RoleEdit], ifMatch(`"1"`))
	fields := fieldsOf(decode(t, response))
	if response.Code != 200 || fields["title"] != "Release steps" || fields["abstract"] != "What to do before a release" || fields["body"] != "Tag first." || fields["unknown_field"] != nil {
		t.Fatalf("%d %v", response.Code, fields)
	}
}

func TestAnUpdateThatChangesNothingWritesNoVersion(t *testing.T) {
	made := newFixture(t)
	createChecklist(t, made)
	response := made.requestResponse("PUT", "/items/doc/1", `{"fields": {"body": "Tag first."}}`, made.tokens[store.RoleEdit], ifMatch(`"1"`))
	if response.Code != 200 || decode(t, response)["version"] != float64(1) {
		t.Fatalf("%d %s", response.Code, response.Body.String())
	}
}

func TestAStaleUpdateIs409AndCarriesTheNewestItem(t *testing.T) {
	made := newFixture(t)
	createChecklist(t, made)
	made.requestResponse("PUT", "/items/doc/1", `{"fields": {"body": "Build, then tag."}}`, made.tokens[store.RoleAdmin], ifMatch(`"1"`))
	response := made.requestResponse("PUT", "/items/doc/1", `{"fields": {"body": "Tag first, then build."}}`, made.tokens[store.RoleEdit], ifMatch(`"1"`))
	body := decode(t, response)
	current, _ := body["current"].(map[string]any)
	if response.Code != http.StatusConflict || response.Header().Get("ETag") != `"2"` || current["version"] != float64(2) || fieldsOf(current)["body"] != "Build, then tag." || current["updated_by"] != "Ada" {
		t.Fatalf("%d %s", response.Code, response.Body.String())
	}
	expectErrorShape(t, response)
	if read := decode(t, made.requestResponse("GET", "/items/doc/1", "", made.tokens[store.RoleRead], nil)); fieldsOf(read)["body"] != "Build, then tag." {
		t.Errorf("the stale write was kept: %v", read)
	}
}

func TestAnUpdateWithoutIfMatchIs428(t *testing.T) {
	made := newFixture(t)
	createChecklist(t, made)
	response := made.requestResponse("PUT", "/items/doc/1", `{"fields": {"body": "x"}}`, made.tokens[store.RoleEdit], nil)
	if response.Code != http.StatusPreconditionRequired {
		t.Fatalf("%d", response.Code)
	}
	expectErrorShape(t, response)
	if made.requestResponse("PUT", "/items/doc/1", `{"fields": {"body": "x"}}`, made.tokens[store.RoleEdit], ifMatch("later")).Code != http.StatusBadRequest {
		t.Error("an If-Match that is no number was not refused with 400")
	}
}

func TestACreateThatLacksAFieldOrBreaksARuleIs400(t *testing.T) {
	made := newFixture(t)
	admin := made.tokens[store.RoleAdmin]
	bad := []struct{ path, body string }{
		{"/items/doc", `{"fields": {"title": "No body", "abstract": "x"}}`},
		{"/items/doc", `{"fields": {"title": "", "abstract": "x", "body": "y"}}`},
		{"/items/check", `{"fields": {"title": "Suite", "command": "true", "brief": "", "interval_minutes": -5}}`},
		{"/items/sequence", `{"fields": {"title": "Steps", "steps": "not json", "step_guards": "[]"}}`},
		{"/items/doc", `{"fields": {"title": ["a"], "abstract": "x", "body": "y"}}`},
		{"/items/doc", `{"fields": {"title": "T", "abstract": "x", "body": 1.5}}`},
		{"/items/doc", `{}`},
	}
	for _, c := range bad {
		response := made.requestResponse("POST", c.path, c.body, admin, nil)
		if response.Code != http.StatusBadRequest {
			t.Errorf("%s %s: %d %s", c.path, c.body, response.Code, response.Body.String())
		}
		expectErrorShape(t, response)
	}
}

func TestABodyOver2MiBIs413OnCreateAndOnUpdate(t *testing.T) {
	made := newFixture(t)
	createChecklist(t, made)
	large := `{"fields": {"title": "T", "abstract": "A", "body": "` + strings.Repeat("x", 3<<20) + `"}}`
	if code := made.requestResponse("POST", "/items/doc", large, made.tokens[store.RoleEdit], nil).Code; code != http.StatusRequestEntityTooLarge {
		t.Errorf("create: %d", code)
	}
	if code := made.requestResponse("PUT", "/items/doc/1", large, made.tokens[store.RoleEdit], ifMatch(`"1"`)).Code; code != http.StatusRequestEntityTooLarge {
		t.Errorf("update: %d", code)
	}
}

func TestAnItemOfEveryKindIsMadeAndReadWithItsTypes(t *testing.T) {
	made := newFixture(t)
	edit := made.tokens[store.RoleEdit]
	sequence := made.requestResponse("POST", "/items/sequence", `{"fields": {"title": "Steps", "steps": "[{\"text\": \"one\"}]", "step_guards": "[]"}}`, edit, nil)
	check := made.requestResponse("POST", "/items/check", `{"fields": {"title": "Suite", "command": "true", "brief": "runs the suite", "interval_minutes": 15}}`, edit, nil)
	if sequence.Code != 201 || check.Code != 201 || fieldsOf(decode(t, check))["interval_minutes"] != float64(15) {
		t.Fatalf("%d %d %s", sequence.Code, check.Code, check.Body.String())
	}
	if made.requestResponse("GET", "/items/check/1", "", edit, nil).Code != 200 || made.requestResponse("GET", "/items/sequence/1", "", edit, nil).Code != 200 {
		t.Error("an item was not read back")
	}
}

func TestAnUnknownKindOrItemIs404(t *testing.T) {
	made := newFixture(t)
	admin := made.tokens[store.RoleAdmin]
	for _, path := range []string{"/items/note/1", "/items/doc/99", "/items/doc/one", "/items?kind=note"} {
		if code := made.requestResponse("GET", path, "", admin, nil).Code; code != 404 {
			t.Errorf("%s: %d", path, code)
		}
	}
	if made.requestResponse("POST", "/items/note", checklist, admin, nil).Code != 404 || made.requestResponse("PUT", "/items/doc/99", checklist, admin, ifMatch(`"1"`)).Code != 404 {
		t.Error("a write to an unknown kind or item was not 404")
	}
}

func TestTheListPagesSearchesAndShowsAnExcerptAroundTheFirstTerm(t *testing.T) {
	made := newFixture(t)
	admin := made.tokens[store.RoleAdmin]
	for _, body := range []string{
		`{"fields": {"title": "Release checklist", "abstract": "Before a release", "body": "Tag first, then build the wheels and upload them."}}`,
		`{"fields": {"title": "Onboarding", "abstract": "New people", "body": "Ask for a token. 100% of people need one_"}}`,
		`{"fields": {"title": "Notes", "abstract": "Misc", "body": "Nothing about it"}}`,
	} {
		made.requestResponse("POST", "/items/doc", body, admin, nil)
	}
	all := decode(t, made.requestResponse("GET", "/items?kind=doc&size=2&page=1", "", admin, nil))
	rows, _ := all["rows"].([]any)
	if all["total"] != float64(3) || all["size"] != float64(2) || len(rows) != 2 || rows[0].(map[string]any)["title"] != "Notes" {
		t.Fatalf("%v", all)
	}
	second := decode(t, made.requestResponse("GET", "/items?kind=doc&size=2&page=2", "", admin, nil))
	if secondRows, _ := second["rows"].([]any); len(secondRows) != 1 {
		t.Fatalf("%v", second)
	}
	searchResponse := decode(t, made.requestResponse("GET", "/items?kind=doc&search=BUILD+tag", "", admin, nil))
	foundRows, _ := searchResponse["rows"].([]any)
	row, _ := foundRows[0].(map[string]any)
	if searchResponse["total"] != float64(1) || row["title"] != "Release checklist" || row["abstract"] != "Before a release" || !strings.Contains(row["excerpt"].(string), "build") || row["creator"] != "Ada" {
		t.Fatalf("%v", searchResponse)
	}
	if _, hasText := row["fields"]; hasText {
		t.Error("a list row carries the item's text")
	}
	for _, search := range []string{"100%25", "one_", "%25"} {
		literal := decode(t, made.requestResponse("GET", "/items?kind=doc&search="+search, "", admin, nil))
		if literal["total"] != float64(1) {
			t.Errorf("search %q matched %v", search, literal["total"])
		}
	}
	for _, query := range []string{"page=0", "size=0", "size=101", "page=two"} {
		if code := made.requestResponse("GET", "/items?kind=doc&"+query, "", admin, nil).Code; code != 400 {
			t.Errorf("%s: %d", query, code)
		}
	}
}

func TestAnAdminRemovesAndRestoresAnItemAndAPutOnARemovedItemIs410(t *testing.T) {
	made := newFixture(t)
	createChecklist(t, made)
	if made.requestResponse("DELETE", "/items/doc/1", "", made.tokens[store.RoleEdit], nil).Code != http.StatusForbidden {
		t.Error("an editor removed an item")
	}
	removed := made.requestResponse("DELETE", "/items/doc/1", "", made.tokens[store.RoleAdmin], nil)
	body := decode(t, removed)
	if removed.Code != 200 || body["removed_at"] == nil || body["version"] != float64(2) {
		t.Fatalf("%d %v", removed.Code, body)
	}
	if read := decode(t, made.requestResponse("GET", "/items/doc/1", "", made.tokens[store.RoleRead], nil)); read["removed_at"] == nil {
		t.Error("a removed item does not say so")
	}
	if listed := decode(t, made.requestResponse("GET", "/items?kind=doc", "", made.tokens[store.RoleRead], nil)); listed["total"] != float64(0) {
		t.Errorf("a removed item is listed: %v", listed)
	}
	removedResponse := made.requestResponse("PUT", "/items/doc/1", `{"fields": {"body": "x"}}`, made.tokens[store.RoleEdit], ifMatch(`"2"`))
	if removedResponse.Code != http.StatusGone {
		t.Fatalf("%d", removedResponse.Code)
	}
	expectErrorShape(t, removedResponse)
	if made.requestResponse("POST", "/items/doc/1/restore", "", made.tokens[store.RoleEdit], nil).Code != http.StatusForbidden {
		t.Error("an editor restored an item")
	}
	restored := decode(t, made.requestResponse("POST", "/items/doc/1/restore", "", made.tokens[store.RoleAdmin], nil))
	if restored["removed_at"] != nil || restored["version"] != float64(3) {
		t.Fatalf("%v", restored)
	}
	if code := made.requestResponse("PUT", "/items/doc/1", `{"fields": {"body": "back"}}`, made.tokens[store.RoleEdit], ifMatch(`"3"`)).Code; code != 200 {
		t.Errorf("a restored item is not writable: %d", code)
	}
}

func TestTheVersionsOfAnItemAreListedWithoutTextAndEachCanBeRead(t *testing.T) {
	made := newFixture(t)
	laptop, _, _ := made.store.NewToken(1, "laptop")
	if made.requestResponse("POST", "/items/doc", checklist, laptop, nil).Code != 201 {
		t.Fatal("create failed")
	}
	made.requestResponse("PUT", "/items/doc/1", `{"fields": {"body": "Tag first, then build."}}`, made.tokens[store.RoleEdit], ifMatch(`"1"`))
	listed := made.requestResponse("GET", "/items/doc/1/versions", "", made.tokens[store.RoleRead], nil)
	versions, _ := decode(t, listed)["versions"].([]any)
	if listed.Code != 200 || len(versions) != 2 {
		t.Fatalf("%d %s", listed.Code, listed.Body.String())
	}
	newest, oldest := versions[0].(map[string]any), versions[1].(map[string]any)
	if newest["version"] != float64(2) || newest["action"] != "update" || newest["user"] != "Grace" || oldest["user"] != "Ada" || oldest["token"] != "laptop" || oldest["created_at"] == nil {
		t.Fatalf("%v", versions)
	}
	if _, hasText := newest["fields"]; hasText || strings.Contains(listed.Body.String(), "Tag first") {
		t.Error("the list of versions carries the text")
	}
	first := decode(t, made.requestResponse("GET", "/items/doc/1/versions/1", "", made.tokens[store.RoleRead], nil))
	if fieldsOf(first)["body"] != "Tag first." || first["action"] != "create" || first["version"] != float64(1) {
		t.Fatalf("%v", first)
	}
	for _, path := range []string{"/items/doc/1/versions/9", "/items/doc/1/versions/x", "/items/doc/9/versions", "/items/note/1/versions"} {
		if code := made.requestResponse("GET", path, "", made.tokens[store.RoleRead], nil).Code; code != 404 {
			t.Errorf("%s: %d", path, code)
		}
	}
}
