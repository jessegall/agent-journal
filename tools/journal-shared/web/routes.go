// Package web is the shared server's HTTP API: the routes, the access checks and the JSON errors.
package web

import (
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"strconv"

	"github.com/jessegall/agent-journal/tools/journal-shared/store"
)

// maxBody is the largest request the server reads.
const maxBody = 2 << 20

// Server answers the HTTP API from one store.
type Server struct {
	store    *store.Store
	protocol int
}

// Routes builds the handler of every route.
func Routes(database *store.Store, protocol int) http.Handler {
	server := &Server{store: database, protocol: protocol}
	routes := http.NewServeMux()
	routes.HandleFunc("GET /info", server.serverInfo)
	routes.HandleFunc("GET /me", server.guard(store.RoleRead, server.currentUser))
	routes.HandleFunc("GET /users", server.guard(store.RoleAdmin, server.listUsers))
	routes.HandleFunc("POST /users", server.guard(store.RoleAdmin, server.addUser))
	routes.HandleFunc("PATCH /users/{id}", server.guard(store.RoleAdmin, server.changeUser))
	routes.HandleFunc("DELETE /users/{id}", server.guard(store.RoleAdmin, server.removeUser))
	routes.HandleFunc("GET /users/{id}/tokens", server.guard(store.RoleAdmin, server.listTokens))
	routes.HandleFunc("POST /users/{id}/tokens", server.guard(store.RoleAdmin, server.addToken))
	routes.HandleFunc("DELETE /tokens/{id}", server.guard(store.RoleRead, server.revokeToken))
	routes.HandleFunc("GET /state", server.guard(store.RoleRead, server.state))
	routes.HandleFunc("GET /items", server.guard(store.RoleRead, server.listItems))
	routes.HandleFunc("POST /items/{kind}", server.guard(store.RoleEdit, server.createItem))
	routes.HandleFunc("GET /items/{kind}/{id}", server.guard(store.RoleRead, server.readItem))
	routes.HandleFunc("PUT /items/{kind}/{id}", server.guard(store.RoleEdit, server.updateItem))
	routes.HandleFunc("DELETE /items/{kind}/{id}", server.guard(store.RoleAdmin, server.removeItem))
	routes.HandleFunc("POST /items/{kind}/{id}/restore", server.guard(store.RoleAdmin, server.restoreItem))
	routes.HandleFunc("GET /items/{kind}/{id}/versions", server.guard(store.RoleRead, server.listVersions))
	routes.HandleFunc("GET /items/{kind}/{id}/versions/{version}", server.guard(store.RoleRead, server.readVersion))
	routes.HandleFunc("/", func(response http.ResponseWriter, _ *http.Request) {
		writeError(response, http.StatusNotFound, "there is no such route", "see the routes in the design of the shared library")
	})
	return routes
}

func (server *Server) serverInfo(response http.ResponseWriter, _ *http.Request) {
	writeJSON(response, http.StatusOK, map[string]any{"server_key": server.store.ServerKey, "name": server.store.ServerName, "protocol": server.protocol, "kinds": store.KindNames()})
}

func (server *Server) currentUser(response http.ResponseWriter, _ *http.Request, caller store.Caller) {
	writeJSON(response, http.StatusOK, map[string]any{"name": caller.User.Name, "role": caller.User.Role})
}

func writeJSON(response http.ResponseWriter, status int, body any) {
	response.Header().Set("Content-Type", "application/json")
	response.WriteHeader(status)
	json.NewEncoder(response).Encode(body)
}

func writeError(response http.ResponseWriter, status int, message, hint string) {
	writeJSON(response, status, map[string]string{"error": message, "hint": hint})
}

// readJSON reads the body into target, or answers 413 or 400 and says so.
func readJSON(response http.ResponseWriter, request *http.Request, target any) bool {
	decoder := json.NewDecoder(http.MaxBytesReader(response, request.Body, maxBody))
	decoder.UseNumber()
	err := decoder.Decode(target)
	var tooLarge *http.MaxBytesError
	if errors.As(err, &tooLarge) {
		writeError(response, http.StatusRequestEntityTooLarge, "the request is over 2 MiB", "send less in one request")
		return false
	}
	if err != nil {
		writeError(response, http.StatusBadRequest, "the body is not the JSON this route reads", "send a JSON object with the fields of the route")
		return false
	}
	return true
}

func pathNumber(request *http.Request, name string) (int64, bool) {
	number, err := strconv.ParseInt(request.PathValue(name), 10, 64)
	return number, err == nil
}

// fail answers an error from the store with its status.
func fail(response http.ResponseWriter, err error) {
	switch {
	case errors.Is(err, store.ErrRemoved):
		writeError(response, http.StatusGone, "the item is removed", "ask an admin to restore it")
	case errors.Is(err, store.ErrNotFound):
		writeError(response, http.StatusNotFound, "there is no such item", "check the number")
	case errors.Is(err, store.ErrBadRole), errors.Is(err, store.ErrBadName), errors.Is(err, store.ErrBadFields):
		writeError(response, http.StatusBadRequest, err.Error(), "fix the field and send it again")
	case errors.Is(err, store.ErrNameTaken):
		writeError(response, http.StatusBadRequest, err.Error(), "pick another name")
	default:
		log.Printf("journal-shared: %v", err)
		writeError(response, http.StatusInternalServerError, "the server could not do this", "ask the person who runs the server to read its log")
	}
}
