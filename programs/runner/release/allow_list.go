package release

import (
	"encoding/json"
	"os"
	"path/filepath"

	"journal-runner/device"
	"journal-runner/host"
	"journal-runner/hostapi"
)

// WriteAllowList writes the host's list of the programs a connected relay may open: each listed program whose
// official install the installation sealed, by its host name, so the journal's list chooses only among sealed
// programs and never widens the list by itself.
func WriteAllowList(stateFolder, installation string, programs []Program) error {
	verified, err := host.Installation{Folder: installation}.Verify()
	if err != nil {
		return err
	}
	sealed := map[string]string{}
	for _, artifact := range verified {
		sealed[artifact.Name] = artifact.Path
	}
	allowed := hostapi.AllowedPrograms{Release: filepath.Base(installation), Programs: map[string]string{}}
	for _, program := range programs {
		if path, found := sealed["bin/"+program.Executable]; found {
			allowed.Programs[program.HostName] = path
		}
	}
	content, err := json.Marshal(allowed)
	if err != nil {
		return err
	}

	path := hostapi.AllowedProgramsFile(stateFolder, allowed.Release)
	if err := os.MkdirAll(filepath.Dir(path), 0o700); err != nil {
		return err
	}

	return device.WritePrivateFile(path, content)
}
