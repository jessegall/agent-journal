package web

import (
	"errors"
	"fmt"
	"net/http"
	"strings"

	"github.com/jessegall/agent-journal/tools/journal-shared/store"
)

// route answers a request from a caller who passed the access check.
type route func(response http.ResponseWriter, request *http.Request, caller store.Caller)

// guard checks the protocol, then the token, then the role, before the route runs. The Authorization header is read
// here and nowhere else, and is never logged.
func (server *Server) guard(minimum store.Role, next route) http.HandlerFunc {
	return func(response http.ResponseWriter, request *http.Request) {
		if request.Header.Get("Journal-Protocol") != fmt.Sprint(server.protocol) {
			writeError(response, http.StatusUpgradeRequired, "this server speaks protocol "+fmt.Sprint(server.protocol), "update whichever of the journal and the server is behind")
			return
		}
		text, valid := strings.CutPrefix(request.Header.Get("Authorization"), "Bearer ")
		if !valid {
			writeError(response, http.StatusUnauthorized, "the token is missing", "send Authorization: Bearer <token>")
			return
		}
		caller, err := server.store.Authenticate(text)
		if errors.Is(err, store.ErrNotAuthenticated) {
			writeError(response, http.StatusUnauthorized, err.Error(), "ask an admin for a token")
			return
		}
		if err != nil {
			fail(response, err)
			return
		}
		if !caller.User.Role.Allows(minimum) {
			writeError(response, http.StatusForbidden, "your role cannot do this", "ask an admin for "+string(minimum)+" rights")
			return
		}
		next(response, request, caller)
	}
}
