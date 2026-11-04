package main

import (
	"os"
	"path/filepath"
)

// unbufferedPython makes Python write each line as it comes, which changes nothing but when its output arrives.
const unbufferedPython = "PYTHONUNBUFFERED"

func journalEnvironment(home string) []string {
	path := filepath.Join(home, "bin") + string(os.PathListSeparator) + os.Getenv("PATH")
	environment := append(os.Environ(), "JOURNAL_HOME="+home, "PATH="+path)
	if _, isSet := os.LookupEnv(unbufferedPython); !isSet {
		environment = append(environment, unbufferedPython+"=1")
	}
	return environment
}
