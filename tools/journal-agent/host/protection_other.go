//go:build !darwin && !linux

package host

// platformMechanisms names no mechanism: the pinned clients have no sandbox for their tools on this platform.
func platformMechanisms() map[string]DriverMechanisms {
	missing := map[BoundaryItem]BoundaryMechanism{}
	for _, item := range BoundaryItems {
		missing[item] = unavailable("the pinned clients have no tool sandbox on this platform")
	}
	return map[string]DriverMechanisms{"claude": missing, "codex": missing}
}
