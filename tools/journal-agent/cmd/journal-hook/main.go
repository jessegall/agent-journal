// Command journal-hook is the native hook adapter: a provider runs it on every hook event, and it answers with the
// journal's reply, asked through the session's relay on a machine connected to a server journal and directly from a
// session container, or with the provider's own blocking reply when the journal cannot be asked in time.
package main

import (
	"fmt"
	"io"
	"os"
	"path/filepath"
	"strconv"

	"journal-agent/client"
	"journal-agent/hookadapter"
)

func main() {
	if len(os.Args) != 3 {
		fmt.Fprintln(os.Stderr, "usage: journal-hook <driver> <reply file>")
		os.Exit(2)
	}
	native, err := io.ReadAll(os.Stdin)
	if err != nil {
		fmt.Fprintln(os.Stderr, "journal-hook:", err)
		os.Exit(2)
	}

	adapter := adapterFor(os.Args[1])
	adapter.RepliesFile = os.Args[2]
	reply := adapter.Answer(native)
	fmt.Fprint(os.Stdout, reply.Stdout)
	fmt.Fprint(os.Stderr, reply.Stderr)
	os.Exit(reply.ExitCode)
}

// adapterFor is the adapter of this call's session. On a machine connected to a server journal the run folder
// locates the session socket, and the relay serving it holds the runtime's authority. In a session container there
// is no relay: the start's own grant is in the environment, and the call goes to the journal directly.
func adapterFor(driver string) hookadapter.Adapter {
	if runFolder := os.Getenv("JOURNAL_SESSION_RUN"); runFolder != "" {
		return hookadapter.Adapter{
			Ask:             hookadapter.AskThroughSocket(filepath.Join(runFolder, hookadapter.SocketName), driver),
			PreparationFile: filepath.Join(runFolder, "prepared"),
		}
	}

	grant, granted := client.StartGrantFrom(os.LookupEnv)
	if !granted {
		return hookadapter.Adapter{Ask: hookadapter.RefuseWithoutGrant}
	}
	generation, _ := strconv.Atoi(os.Getenv("JOURNAL_PROCESS_GENERATION"))

	return hookadapter.Adapter{
		Ask:             hookadapter.AskJournal(grant, driver, generation),
		PreparationFile: filepath.Join(os.TempDir(), "journal-hook-"+strconv.Itoa(os.Getuid())+".prepared"),
	}
}
