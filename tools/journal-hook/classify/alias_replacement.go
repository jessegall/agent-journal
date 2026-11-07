package classify

type aliasReplacement struct {
	names []string
	start int
	end   int
	line  string
}

// savedRun is a saved command a line runs: the alias, the line it expands to and what the agent reads of its output.
type savedRun struct {
	name            string
	line            string
	selection       string
	timeoutDuration *string
}

// categorisedRun is an alias with a category that a line runs: the line it expands to and the alias's category.
type categorisedRun struct {
	line     string
	category string
}
