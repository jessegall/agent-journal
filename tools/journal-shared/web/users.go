package web

import (
	"net/http"

	"github.com/jessegall/agent-journal/tools/journal-shared/store"
)

func (server *Server) listUsers(response http.ResponseWriter, _ *http.Request, _ store.Caller) {
	users, err := server.store.Users()
	if err != nil {
		fail(response, err)
		return
	}
	writeJSON(response, http.StatusOK, map[string]any{"users": users})
}

func (server *Server) addUser(response http.ResponseWriter, request *http.Request, _ store.Caller) {
	var body struct {
		Name string `json:"name"`
		Role string `json:"role"`
	}
	if !readJSON(response, request, &body) {
		return
	}
	role, err := store.ParseRole(body.Role)
	if err != nil {
		fail(response, err)
		return
	}
	user, err := server.store.AddUser(body.Name, role)
	if err != nil {
		fail(response, err)
		return
	}
	text, token, err := server.store.NewToken(user.ID, "")
	if err != nil {
		fail(response, err)
		return
	}
	writeJSON(response, http.StatusCreated, map[string]any{"user": user, "token": token, "token_text": text})
}

func (server *Server) changeUser(response http.ResponseWriter, request *http.Request, _ store.Caller) {
	id, valid := pathNumber(request, "id")
	var body struct {
		Role string `json:"role"`
	}
	if !valid {
		fail(response, store.ErrNotFound)
		return
	}
	if !readJSON(response, request, &body) {
		return
	}
	role, err := store.ParseRole(body.Role)
	if err != nil {
		fail(response, err)
		return
	}
	user, err := server.store.SetRole(id, role)
	if err != nil {
		fail(response, err)
		return
	}
	writeJSON(response, http.StatusOK, map[string]any{"user": user})
}

func (server *Server) removeUser(response http.ResponseWriter, request *http.Request, _ store.Caller) {
	id, valid := pathNumber(request, "id")
	if !valid {
		fail(response, store.ErrNotFound)
		return
	}
	user, err := server.store.RemoveUser(id)
	if err != nil {
		fail(response, err)
		return
	}
	writeJSON(response, http.StatusOK, map[string]any{"user": user})
}

func (server *Server) listTokens(response http.ResponseWriter, request *http.Request, _ store.Caller) {
	id, valid := pathNumber(request, "id")
	if !valid {
		fail(response, store.ErrNotFound)
		return
	}
	if _, err := server.store.UserByID(id); err != nil {
		fail(response, err)
		return
	}
	tokens, err := server.store.Tokens(id)
	if err != nil {
		fail(response, err)
		return
	}
	writeJSON(response, http.StatusOK, map[string]any{"tokens": tokens})
}

func (server *Server) addToken(response http.ResponseWriter, request *http.Request, _ store.Caller) {
	id, valid := pathNumber(request, "id")
	var body struct {
		Label string `json:"label"`
	}
	if !valid {
		fail(response, store.ErrNotFound)
		return
	}
	if !readJSON(response, request, &body) {
		return
	}
	text, token, err := server.store.NewToken(id, body.Label)
	if err != nil {
		fail(response, err)
		return
	}
	writeJSON(response, http.StatusCreated, map[string]any{"token": token, "token_text": text})
}

func (server *Server) revokeToken(response http.ResponseWriter, request *http.Request, caller store.Caller) {
	id, valid := pathNumber(request, "id")
	if !valid {
		fail(response, store.ErrNotFound)
		return
	}
	token, err := server.store.Token(id)
	if err != nil {
		fail(response, err)
		return
	}
	if token.UserID != caller.User.ID && !caller.User.Role.Allows(store.RoleAdmin) {
		writeError(response, http.StatusForbidden, "only an admin or the token's owner revokes a token", "ask an admin to revoke it")
		return
	}
	token, err = server.store.RevokeToken(id)
	if err != nil {
		fail(response, err)
		return
	}
	writeJSON(response, http.StatusOK, map[string]any{"token": token})
}
