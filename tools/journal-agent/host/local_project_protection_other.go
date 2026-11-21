//go:build !darwin && !linux

package host

// localProjectConfinement refuses: this platform has no mechanism that confines a local-project start.
func localProjectConfinement(_ LocalProjectFolders, _ string, _ string) (confinement, error) {
	return confinement{}, ErrLocalProjectUnprotected
}
