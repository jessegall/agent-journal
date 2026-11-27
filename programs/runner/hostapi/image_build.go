package hostapi

import (
	"context"
	"errors"

	"journal-runner/host"
)

// BuildImage has the Docker daemon build the image the journal signed and answers Docker's facts. The built image is
// not allowed by being built: a container runs it only once allow_images names its digest. A daemon this host cannot
// reach refuses the build as an image fault about the image's name.
func (table *ProcessTable) BuildImage(ctx context.Context, _ Instruction, plan host.ImageBuild) (host.ImageBuilt, error) {
	if table.containers.Daemon == nil {
		return host.ImageBuilt{}, imageFault(ImageFaultDaemonUnavailable, plan.Name, errNoDaemon)
	}
	built, err := table.containers.BuildImage(ctx, plan)
	if errors.Is(err, host.ErrDaemonUnreachable) {
		return host.ImageBuilt{}, imageFault(ImageFaultDaemonUnavailable, plan.Name, err.Error())
	}
	return built, err
}

// imageFaults are the protocol's image faults by the host's error for each.
var imageFaults = map[error]ImageFaultType{
	host.ErrImageAbsent:       ImageFaultImageAbsent,
	host.ErrDigestMismatch:    ImageFaultDigestMismatch,
	host.ErrDaemonUnreachable: ImageFaultDaemonUnavailable,
}

// refusalOf is an error of the host as the refusal it answers: an image the daemon cannot give is an image fault
// about that image; any other error is itself.
func refusalOf(err error) error {
	var unusable host.ImageUnusable
	if !errors.As(err, &unusable) {
		return err
	}
	return imageFault(imageFaults[unusable.Fault], unusable.Reference, err.Error())
}

// imageFault is the image_fault refusal about the image, with its typed facts.
func imageFault(fault ImageFaultType, reference string, reason string) RefusalError {
	facts, _ := factsOf(ImageFaultFacts{Fault: fault, Reference: reference}, nil)
	return RefusalError{Refusal: ImageFault, Reason: reason, Facts: facts}
}
