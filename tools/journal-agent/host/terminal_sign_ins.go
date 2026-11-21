package host

import (
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"regexp"
)

// TerminalSelectorVariable names, in a shell journal terminal open started, the selector its sign-in is kept under.
const TerminalSelectorVariable = "JOURNAL_TERMINAL"

// terminalsFolderName holds one private file per terminal sign-in of the binding.
const terminalsFolderName = "terminals"

// ErrNoSignIn is returned for a terminal that has no sign-in kept.
var ErrNoSignIn = errors.New("this terminal has no sign-in kept")

// ErrSelectorMalformed refuses a selector that is not one journal terminal open made.
var ErrSelectorMalformed = errors.New("the terminal selector is not one journal terminal open made")

var selectorShape = regexp.MustCompile(`^[0-9a-f]{32}$`)

// TerminalSignIn is one terminal's sign-in of the binding: the selector its shell holds, which is only a lookup key,
// the grant's nonsecret reference and generation, and the bearer once the owner approved it.
type TerminalSignIn struct {
	Selector   string `json:"selector"`
	Reference  string `json:"reference"`
	Generation int    `json:"generation"`
	Grant      string `json:"grant,omitempty"`
}

// NewTerminalSelector is a fresh random selector for a new terminal sign-in.
func NewTerminalSelector() (string, error) {
	random := make([]byte, 16)
	if _, err := rand.Read(random); err != nil {
		return "", err
	}

	return hex.EncodeToString(random), nil
}

// SaveSignIn keeps the terminal's sign-in privately, by its selector.
func (state ConnectionState) SaveSignIn(signIn TerminalSignIn) error {
	path, err := state.signInPath(signIn.Selector)
	if err != nil {
		return err
	}
	if err := os.MkdirAll(filepath.Dir(path), stateFolderMode); err != nil {
		return err
	}

	return writePrivateJSON(path, signIn)
}

// SignIn is the sign-in kept for the terminal of this selector; ErrNoSignIn while there is none.
func (state ConnectionState) SignIn(selector string) (TerminalSignIn, error) {
	path, err := state.signInPath(selector)
	if err != nil {
		return TerminalSignIn{}, err
	}
	content, err := os.ReadFile(path)
	if errors.Is(err, os.ErrNotExist) {
		return TerminalSignIn{}, ErrNoSignIn
	}
	if err != nil {
		return TerminalSignIn{}, err
	}
	var signIn TerminalSignIn

	return signIn, json.Unmarshal(content, &signIn)
}

// SignIns are every terminal sign-in the binding keeps.
func (state ConnectionState) SignIns() ([]TerminalSignIn, error) {
	paths, err := filepath.Glob(filepath.Join(state.folder(), terminalsFolderName, "*.json"))
	if err != nil {
		return nil, err
	}
	signIns := []TerminalSignIn{}
	for _, path := range paths {
		signIn, err := state.SignIn(filepath.Base(path[:len(path)-len(".json")]))
		if err != nil {
			return nil, err
		}
		signIns = append(signIns, signIn)
	}

	return signIns, nil
}

// SignInOf is the kept sign-in of this reference, for journal terminal open --resume; ErrNoSignIn while none.
func (state ConnectionState) SignInOf(reference string) (TerminalSignIn, error) {
	signIns, err := state.SignIns()
	if err != nil {
		return TerminalSignIn{}, err
	}
	for _, signIn := range signIns {
		if signIn.Reference == reference {
			return signIn, nil
		}
	}

	return TerminalSignIn{}, fmt.Errorf("%w: no sign-in %s is kept for this folder", ErrNoSignIn, reference)
}

// ClearSignIn forgets the terminal's sign-in when it is still of the refused generation; a refusal that arrives late
// never erases the sign-in that replaced it.
func (state ConnectionState) ClearSignIn(selector string, generation int) error {
	signIn, err := state.SignIn(selector)
	if errors.Is(err, ErrNoSignIn) {
		return nil
	}
	if err != nil {
		return err
	}
	if signIn.Generation != generation {
		return nil
	}
	path, err := state.signInPath(selector)
	if err != nil {
		return err
	}

	return removePrivateFile(path)
}

func (state ConnectionState) signInPath(selector string) (string, error) {
	if !selectorShape.MatchString(selector) {
		return "", ErrSelectorMalformed
	}

	return filepath.Join(state.folder(), terminalsFolderName, selector+".json"), nil
}
