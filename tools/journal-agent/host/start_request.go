package host

import (
	"bufio"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
)

// FolderUseRequest asks whether any container on the agent daemon, running or not yet removed, binds the account
// folder of that plain id, before a displaced folder is signed out and deleted.
type FolderUseRequest struct {
	Folder string `json:"folder"`
}

// FolderUseReply answers whether the folder is still bound; a daemon that cannot be asked answers bound, with why.
type FolderUseReply struct {
	IsBound bool   `json:"isBound"`
	Reason  string `json:"reason,omitempty"`
}

// AccountFolderRequest names one account folder by its plain id, for the host to make or remove: the accounts root
// is root's, so the sign-in service, the program's user, cannot do either itself. A make names its operation, so the
// same make sent again after a lost reply finds its own folder, and a folder another make left is refused.
type AccountFolderRequest struct {
	Folder    string `json:"folder"`
	Operation string `json:"operation,omitempty"`
}

// AccountFolderReply answers whether the folder was made or removed, and why not when it was not.
type AccountFolderReply struct {
	IsDone bool   `json:"isDone"`
	Reason string `json:"reason,omitempty"`
}

// HostRequest is one line the sign-in service sends: one folder use, or an account folder to make or remove.
type HostRequest struct {
	FolderUse    *FolderUseRequest     `json:"folderUse,omitempty"`
	MakeFolder   *AccountFolderRequest `json:"makeFolder,omitempty"`
	RemoveFolder *AccountFolderRequest `json:"removeFolder,omitempty"`
}

// Executor answers the sign-in service's account-folder requests.
type Executor interface {
	FolderUse(ctx context.Context, request FolderUseRequest) (FolderUseReply, error)
	MakeFolder(ctx context.Context, request AccountFolderRequest) (AccountFolderReply, error)
	RemoveFolder(ctx context.Context, request AccountFolderRequest) (AccountFolderReply, error)
}

var (
	// ErrMalformedRequest is returned for a line that is not exactly one complete request.
	ErrMalformedRequest = errors.New("the request is not one complete request")
)

// AnswerHostRequest reads one request line, has the executor carry it out and writes its one reply line.
func AnswerHostRequest(ctx context.Context, connection io.ReadWriter, executor Executor) error {
	line, err := bufio.NewReader(io.LimitReader(connection, 64*1024)).ReadBytes('\n')
	if err != nil {
		return err
	}
	var request HostRequest
	if err := json.Unmarshal(line, &request); err != nil {
		return fmt.Errorf("%w: %v", ErrMalformedRequest, err)
	}
	reply, err := request.carryOut(ctx, executor)
	if err != nil {
		return err
	}
	return json.NewEncoder(connection).Encode(reply)
}

// carryOut runs the one operation the request names; a request naming none, or more than one, is malformed.
func (request HostRequest) carryOut(ctx context.Context, executor Executor) (any, error) {
	switch {
	case request.isFolderUse():
		return executor.FolderUse(ctx, *request.FolderUse)
	case request.isAccountFolder(request.MakeFolder):
		return executor.MakeFolder(ctx, *request.MakeFolder)
	case request.isAccountFolder(request.RemoveFolder):
		return executor.RemoveFolder(ctx, *request.RemoveFolder)
	default:
		return nil, ErrMalformedRequest
	}
}

// isFolderUse is whether the request asks only about one account folder named by a plain id.
func (request HostRequest) isFolderUse() bool {
	return request.operations() == 1 && request.FolderUse != nil && plainAccountID.MatchString(request.FolderUse.Folder)
}

// isAccountFolder is whether the request names only that account folder operation, on a folder named by a plain id.
func (request HostRequest) isAccountFolder(operation *AccountFolderRequest) bool {
	return request.operations() == 1 && operation != nil && plainAccountID.MatchString(operation.Folder)
}

// operations is how many operations the request names; a request names exactly one.
func (request HostRequest) operations() int {
	named := 0
	for _, isNamed := range []bool{request.FolderUse != nil, request.MakeFolder != nil, request.RemoveFolder != nil} {
		if isNamed {
			named++
		}
	}

	return named
}
