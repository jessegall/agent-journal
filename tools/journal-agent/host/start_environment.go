package host

import (
	"os"
	"path/filepath"
	"slices"
	"strings"

	"journal-agent/client"
)

// platformVariables are the host's variables a program needs to run, draw and read text; every other inherited
// variable stays out of a prepared start, so no API key, token, alternate endpoint or personal setting reaches it.
var platformVariables = []string{
	"LANG", "LC_ALL", "LC_CTYPE", "LC_MESSAGES", "TERM", "COLORTERM", "TZ", "USER", "LOGNAME", "SHELL",
}

// noKeychainFolder holds the installation's stand-in for macOS security(1), first on every start's PATH: every
// Keychain call of Claude Code fails, so it reads its login from the account folder's .credentials.json, the same
// on a Mac, on Linux and in a container.
const noKeychainFolder = "journal/tools/accounts/no-keychain"

// systemPath is the part of a prepared start's PATH outside the protected installation.
const systemPath = "/usr/bin:/bin:/usr/sbin:/sbin"

// StartFolders are the folders one prepared start runs with: an empty home of its own, a folder its recipe's empty
// folder variables point into, and the protected installation its programs come from.
type StartFolders struct {
	Home         string
	EmptyFolders string
	Installation string
}

// CleanEnvironment is a prepared start's whole environment: the platform variables kept from the host, an empty
// HOME, a PATH of the protected installation and the system, an empty folder for each variable the recipe names,
// and the recipe's account settings. A variable the recipe removes is never present.
func CleanEnvironment(inherited []string, recipe client.AccountRecipe, folders StartFolders) ([]string, error) {
	environment := []string{}
	for _, entry := range inherited {
		name, _, _ := strings.Cut(entry, "=")
		if slices.Contains(platformVariables, name) {
			environment = append(environment, entry)
		}
	}
	if err := os.MkdirAll(folders.Home, stateFolderMode); err != nil {
		return nil, err
	}
	environment = append(environment,
		"HOME="+folders.Home,
		"PATH="+filepath.Join(folders.Installation, noKeychainFolder)+":"+
			filepath.Join(folders.Installation, "bin")+":"+systemPath,
	)
	for _, name := range recipe.EmptyFolderVariables {
		folder := filepath.Join(folders.EmptyFolders, name)
		if err := os.MkdirAll(folder, stateFolderMode); err != nil {
			return nil, err
		}
		environment = append(environment, name+"="+folder)
	}
	for _, setting := range recipe.Environment {
		environment = append(environment, setting.Name+"="+setting.Value)
	}
	return slices.DeleteFunc(environment, func(entry string) bool {
		name, _, _ := strings.Cut(entry, "=")
		return slices.Contains(recipe.RemovedVariables, name)
	}), nil
}
