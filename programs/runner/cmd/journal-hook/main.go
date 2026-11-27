// Command journal-hook is the native hook adapter: a provider runs it on every hook event, and it answers with the
// journal's reply, asked through the session's relay on a machine connected to a server journal and directly from a
// session container, or with the provider's own blocking reply when the journal cannot be asked in time.
package main

import (
	"fmt"
	"io"
	"os"
	"path/filepath"
	"strings"

	"journal-runner/client"
	"journal-runner/hookadapter"
)

func main() {
	if len(os.Args) != 1+len(hookadapter.Arguments) {
		fmt.Fprintln(os.Stderr, "usage: journal-hook <"+strings.Join(hookadapter.Arguments, "> <")+">")
		os.Exit(2)
	}
	native, err := io.ReadAll(os.Stdin)
	if err != nil {
		fmt.Fprintln(os.Stderr, "journal-hook:", err)
		os.Exit(2)
	}

	reply := adapterFor(os.Args[1], os.Args[2]).Answer(native)
	fmt.Fprint(os.Stdout, reply.Stdout)
	fmt.Fprint(os.Stderr, reply.Stderr)
	os.Exit(reply.ExitCode)
}

// adapterFor is the adapter of this call's session. On a machine connected to a server journal the run folder
// locates the session socket, and the relay serving it holds the runtime's authority. In a session container there
// is no relay: the start's own grant is in the environment, and the call goes to the journal directly.
func adapterFor(driver string, repliesFile string) hookadapter.Adapter {
	if runFolder := os.Getenv("JOURNAL_SESSION_RUN"); runFolder != "" {
		return hookadapter.Adapter{
			Ask:             hookadapter.AskThroughSocket(filepath.Join(runFolder, hookadapter.SocketName), driver),
			RepliesFile:     repliesFile,
			PreparationFile: filepath.Join(runFolder, "prepared"),
		}
	}

	grant, granted := client.StartGrantFrom(os.LookupEnv)
	if !granted {
		return hookadapter.Adapter{Ask: hookadapter.RefuseWithoutGrant, RepliesFile: repliesFile}
	}

	return hookadapter.InContainer(grant, driver, repliesFile)
}
