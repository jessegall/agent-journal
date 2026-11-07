package web

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/jessegall/agent-journal/tools/journal-shared/store"
)

// state answers the list a journal reads each round. Its ETag holds the newest history row and the caller's role, so
// a round with nothing new is a 304 and a role change shows on the next round.
func (server *Server) state(response http.ResponseWriter, request *http.Request, caller store.Caller) {
	newest, items, err := server.store.State()
	if err != nil {
		fail(response, err)
		return
	}
	tag := fmt.Sprintf("%d.%s", newest, caller.User.Role)
	response.Header().Set("ETag", `"`+tag+`"`)
	if matches(request.Header.Get("If-None-Match"), tag) {
		response.WriteHeader(http.StatusNotModified)
		return
	}
	writeJSON(response, http.StatusOK, map[string]any{"server_key": server.store.ServerKey, "role": caller.User.Role, "etag": tag, "items": items})
}

// matches tells whether an If-None-Match header names the tag, weak or not, or is *.
func matches(header, tag string) bool {
	for _, candidateTag := range strings.Split(header, ",") {
		candidateTag = strings.Trim(strings.TrimPrefix(strings.TrimSpace(candidateTag), "W/"), `"`)
		if candidateTag == "*" || candidateTag == tag {
			return true
		}
	}
	return false
}
