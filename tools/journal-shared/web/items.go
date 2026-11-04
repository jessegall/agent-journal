package web

import (
	"errors"
	"fmt"
	"net/http"
	"strconv"
	"strings"

	"github.com/jessegall/agent-journal/tools/journal-shared/store"
)

const (
	defaultPageSize = 30
	largestPageSize = 100
)

type itemBody struct {
	Fields store.Fields `json:"fields"`
}

func (server *Server) createItem(response http.ResponseWriter, request *http.Request, caller store.Caller) {
	kind, found := kindOf(response, request.PathValue("kind"))
	var body itemBody
	if !found || !readJSON(response, request, &body) {
		return
	}
	item, err := server.store.CreateItem(kind, body.Fields, caller)
	if err != nil {
		fail(response, err)
		return
	}
	writeItem(response, http.StatusCreated, item)
}

func (server *Server) readItem(response http.ResponseWriter, request *http.Request, _ store.Caller) {
	kind, id, found := itemOf(response, request)
	if !found {
		return
	}
	item, err := server.store.ReadItem(kind, id)
	if err != nil {
		fail(response, err)
		return
	}
	writeItem(response, http.StatusOK, item)
}

func (server *Server) listItems(response http.ResponseWriter, request *http.Request, _ store.Caller) {
	query := request.URL.Query()
	kind, found := kindOf(response, query.Get("kind"))
	if !found {
		return
	}
	page, pageValid := number(query.Get("page"), 1)
	size, sizeValid := number(query.Get("size"), defaultPageSize)
	if !pageValid || !sizeValid || page < 1 || size < 1 || size > largestPageSize {
		writeError(response, http.StatusBadRequest, "page and size are whole numbers, and size is 1 to 100", "send page=1&size=30")
		return
	}
	listed, err := server.store.ListItems(kind, query.Get("search"), page, size)
	if err != nil {
		fail(response, err)
		return
	}
	writeJSON(response, http.StatusOK, listed)
}

func (server *Server) updateItem(response http.ResponseWriter, request *http.Request, caller store.Caller) {
	kind, id, found := itemOf(response, request)
	if !found {
		return
	}
	match := request.Header.Get("If-Match")
	if match == "" {
		writeError(response, http.StatusPreconditionRequired, "the update does not say which version it changes", `send If-Match: "<version>" with the version you read`)
		return
	}
	base, err := strconv.ParseInt(strings.Trim(match, `"`), 10, 64)
	if err != nil {
		writeError(response, http.StatusBadRequest, "If-Match is not a version number", `send If-Match: "<version>" with the version you read`)
		return
	}
	var body itemBody
	if !readJSON(response, request, &body) {
		return
	}
	item, err := server.store.UpdateItem(kind, id, base, body.Fields, caller)
	if errors.Is(err, store.ErrStale) {
		response.Header().Set("ETag", etag(item))
		writeJSON(response, http.StatusConflict, map[string]any{"error": "this item has changed", "hint": "compare the two versions", "current": item})
		return
	}
	if err != nil {
		fail(response, err)
		return
	}
	writeItem(response, http.StatusOK, item)
}

func writeItem(response http.ResponseWriter, status int, item store.Item) {
	response.Header().Set("ETag", etag(item))
	writeJSON(response, status, item)
}

func etag(item store.Item) string {
	return fmt.Sprintf(`"%d"`, item.Version)
}

// kindOf finds the kind a name stands for, or answers 404.
func kindOf(response http.ResponseWriter, name string) (store.Kind, bool) {
	kind, found := store.KindByName(name)
	if !found {
		writeError(response, http.StatusNotFound, "there is no such kind", "the kinds are "+strings.Join(store.KindNames(), ", "))
	}
	return kind, found
}

// itemOf reads the kind and the number from the path, or answers 404.
func itemOf(response http.ResponseWriter, request *http.Request) (store.Kind, int64, bool) {
	kind, found := kindOf(response, request.PathValue("kind"))
	if !found {
		return kind, 0, false
	}
	id, valid := pathNumber(request, "id")
	if !valid {
		fail(response, store.ErrNotFound)
	}
	return kind, id, valid
}

func number(text string, otherwise int) (int, bool) {
	if text == "" {
		return otherwise, true
	}
	parsed, err := strconv.Atoi(text)
	return parsed, err == nil
}
