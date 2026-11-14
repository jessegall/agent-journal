package web

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/http/httptest"
	"os"
	"strings"
	"testing"

	"github.com/jessegall/agent-journal/tools/journal-shared/store"
)

type fixture struct {
	handler       http.Handler
	store         *store.Store
	tokens        map[store.Role]string
	secondaryUser store.User
	otherID       int64 // the number of the token of the other user
}

// seeded is a fixture with one document, number 1, made by Ada.
func seeded(t *testing.T) fixture {
	t.Helper()
	made := newFixture(t)
	ada, _ := made.store.UserByName("Ada")
	if _, err := made.store.CreateItem(store.Kinds[0], store.Fields{"title": "Seed", "abstract": "Seed", "body": "Seed"}, store.Caller{User: ada}); err != nil {
		t.Fatal(err)
	}
	return made
}

func newFixture(t *testing.T) fixture {
	t.Helper()
	database, err := store.Open(t.TempDir())
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { database.Close() })
	made := fixture{handler: Routes(database, 1), store: database, tokens: map[store.Role]string{}}
	for _, person := range []struct {
		name string
		role store.Role
	}{{"Ada", store.RoleAdmin}, {"Grace", store.RoleEdit}, {"Linus", store.RoleRead}} {
		role := person.role
		user, err := database.AddUser(person.name, role)
		if err != nil {
			t.Fatal(err)
		}
		made.tokens[role], _, _ = database.NewToken(user.ID, "")
	}
	made.secondaryUser, _ = database.AddUser("Other", store.RoleRead)
	_, token, _ := database.NewToken(made.secondaryUser.ID, "")
	made.otherID = token.ID
	return made
}

func (made fixture) requestResponse(method, path, body, token string, headers map[string]string) *httptest.ResponseRecorder {
	request := httptest.NewRequest(method, path, strings.NewReader(body))
	request.Header.Set("Journal-Protocol", "1")
	if token != "" {
		request.Header.Set("Authorization", "Bearer "+token)
	}
	for name, value := range headers {
		request.Header.Set(name, value)
	}
	response := httptest.NewRecorder()
	made.handler.ServeHTTP(response, request)
	return response
}

type routeCase struct {
	method, path, body string
	minimum            store.Role
	success            int
	headers            map[string]string
}

func routeCases(made fixture) []routeCase {
	secondaryUser := fmt.Sprint(made.secondaryUser.ID)
	return []routeCase{
		{"GET", "/me", "", store.RoleRead, 200, nil},
		{"GET", "/users", "", store.RoleAdmin, 200, nil},
		{"POST", "/users", `{"name": "New", "role": "read"}`, store.RoleAdmin, 201, nil},
		{"PATCH", "/users/" + secondaryUser, `{"role": "edit"}`, store.RoleAdmin, 200, nil},
		{"DELETE", "/users/" + secondaryUser, "", store.RoleAdmin, 200, nil},
		{"GET", "/users/" + secondaryUser + "/tokens", "", store.RoleAdmin, 200, nil},
		{"POST", "/users/" + secondaryUser + "/tokens", `{"label": "laptop"}`, store.RoleAdmin, 201, nil},
		{"DELETE", fmt.Sprintf("/tokens/%d", made.otherID), "", store.RoleAdmin, 200, nil},
		{"GET", "/state", "", store.RoleRead, 200, nil},
		{"GET", "/items?kind=doc", "", store.RoleRead, 200, nil},
		{"GET", "/items/doc/1", "", store.RoleRead, 200, nil},
		{"POST", "/items/doc", checklist, store.RoleEdit, 201, nil},
		{"PUT", "/items/doc/1", `{"fields": {"body": "changed"}}`, store.RoleEdit, 200, map[string]string{"If-Match": `"1"`}},
		{"DELETE", "/items/doc/1", "", store.RoleAdmin, 200, nil},
		{"POST", "/items/doc/1/restore", "", store.RoleAdmin, 200, nil},
		{"GET", "/items/doc/1/versions", "", store.RoleRead, 200, nil},
		{"GET", "/items/doc/1/versions/1", "", store.RoleRead, 200, nil},
	}
}

func TestEveryRoleAgainstEveryRoute(t *testing.T) {
	for _, role := range []store.Role{store.RoleAdmin, store.RoleEdit, store.RoleRead} {
		for index := range routeCases(newFixture(t)) {
			made := seeded(t)
			route := routeCases(made)[index]
			response := made.requestResponse(route.method, route.path, route.body, made.tokens[role], route.headers)
			want := route.success
			if !role.Allows(route.minimum) {
				want = http.StatusForbidden
			}
			if response.Code != want {
				t.Errorf("%s %s as %s: %d, wanted %d: %s", route.method, route.path, role, response.Code, want, response.Body.String())
			}
		}
	}
}

func TestEveryRouteRefusesNoTokenAWrongTokenAndARevokedToken(t *testing.T) {
	for index := range routeCases(newFixture(t)) {
		made := seeded(t)
		route := routeCases(made)[index]
		revokedText, revoked, _ := made.store.NewToken(1, "")
		made.store.RevokeToken(revoked.ID)
		for name, token := range map[string]string{"no token": "", "a wrong token": "jsl_wrong", "a revoked token": revokedText} {
			response := made.requestResponse(route.method, route.path, route.body, token, route.headers)
			if response.Code != http.StatusUnauthorized {
				t.Errorf("%s %s with %s: %d", route.method, route.path, name, response.Code)
			}
			expectErrorShape(t, response)
		}
	}
}

func TestARevokedTokenStopsWorkingOnTheNextRequest(t *testing.T) {
	made := newFixture(t)
	if made.requestResponse("GET", "/me", "", made.tokens[store.RoleEdit], nil).Code != 200 {
		t.Fatal("the token did not work before it was revoked")
	}
	tokens, _ := made.store.Tokens(2)
	if response := made.requestResponse("DELETE", fmt.Sprintf("/tokens/%d", tokens[0].ID), "", made.tokens[store.RoleEdit], nil); response.Code != 200 {
		t.Fatalf("a user could not revoke their own token: %d", response.Code)
	}
	if made.requestResponse("GET", "/me", "", made.tokens[store.RoleEdit], nil).Code != http.StatusUnauthorized {
		t.Error("the revoked token still works")
	}
}

func TestEveryRouteButInfoRefusesAMissingOrUnsupportedProtocol(t *testing.T) {
	made := seeded(t)
	for _, route := range routeCases(made) {
		for _, version := range []string{"", "2", "0"} {
			response := made.requestResponse(route.method, route.path, route.body, made.tokens[store.RoleAdmin], mergedHeaders(route.headers, "Journal-Protocol", version))
			if response.Code != http.StatusUpgradeRequired {
				t.Errorf("%s %s with protocol %q: %d", route.method, route.path, version, response.Code)
			}
			expectErrorShape(t, response)
		}
	}
	request := httptest.NewRequest("GET", "/info", nil)
	response := httptest.NewRecorder()
	made.handler.ServeHTTP(response, request)
	if response.Code != 200 || !strings.Contains(response.Body.String(), `"kinds":["doc","sequence","check"]`) || !strings.Contains(response.Body.String(), `"protocol":1`) {
		t.Errorf("/info: %d %s", response.Code, response.Body.String())
	}
}

func TestAReadUserRevokesOwnTokenButNotSomeoneElses(t *testing.T) {
	made := newFixture(t)
	response := made.requestResponse("DELETE", fmt.Sprintf("/tokens/%d", made.otherID), "", made.tokens[store.RoleRead], nil)
	if response.Code != http.StatusForbidden {
		t.Errorf("%d", response.Code)
	}
	expectErrorShape(t, response)
}

func TestAnUnknownRouteAndABadBodyAndALargeBodyAnswerInTheErrorShape(t *testing.T) {
	made := newFixture(t)
	admin := made.tokens[store.RoleAdmin]
	cases := []struct {
		method, path, body string
		status             int
	}{
		{"GET", "/nothing", "", 404},
		{"GET", "/users/99/tokens", "", 404},
		{"POST", "/users", "not json", 400},
		{"POST", "/users", `{"name": "X", "role": "boss"}`, 400},
		{"POST", "/users", `{"name": "Ada", "role": "read"}`, 400},
		{"POST", "/users", `{"name": "` + strings.Repeat("x", 3<<20) + `", "role": "read"}`, 413},
	}
	for _, c := range cases {
		response := made.requestResponse(c.method, c.path, c.body, admin, nil)
		if response.Code != c.status {
			t.Errorf("%s %s: %d, wanted %d", c.method, c.path, response.Code, c.status)
		}
		expectErrorShape(t, response)
	}
}

func TestTheServerNeverLogsTheAuthorizationHeader(t *testing.T) {
	var logged bytes.Buffer
	log.SetOutput(&logged)
	defer log.SetOutput(os.Stderr)
	made := newFixture(t)
	made.requestResponse("GET", "/me", "", "jsl_secret", nil)
	made.requestResponse("GET", "/me", "", made.tokens[store.RoleAdmin], nil)
	if strings.Contains(logged.String(), "jsl_") || strings.Contains(logged.String(), "Bearer") {
		t.Errorf("the log holds a token: %s", logged.String())
	}
}

func expectErrorShape(t *testing.T, response *httptest.ResponseRecorder) {
	t.Helper()
	var body map[string]any
	if err := json.Unmarshal(response.Body.Bytes(), &body); err != nil || body["error"] == nil || body["error"] == "" || body["hint"] == nil || body["hint"] == "" {
		t.Errorf("not the error shape: %s", response.Body.String())
	}
}

func mergedHeaders(headers map[string]string, name, value string) map[string]string {
	merged := map[string]string{name: value}
	for key, existing := range headers {
		merged[key] = existing
	}
	return merged
}
