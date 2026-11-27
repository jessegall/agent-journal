package host

import (
	"context"
	"errors"
	"fmt"
	"slices"
	"strings"

	"github.com/moby/moby/client"
)

var (
	// ErrImageAbsent is an image the Docker daemon does not hold.
	ErrImageAbsent = errors.New("the Docker daemon does not hold the image")
	// ErrDigestMismatch is an image the Docker daemon holds under the reference's name with another digest.
	ErrDigestMismatch = errors.New("the Docker daemon holds another digest under the image's name")
)

// ImageUnusable is an image a container or a build cannot use, and why: ErrImageAbsent, ErrDigestMismatch or
// ErrDaemonUnreachable, with the reference it is about.
type ImageUnusable struct {
	Fault     error
	Reference string
	Detail    string
}

func (unusable ImageUnusable) Error() string {
	return fmt.Sprintf("%v: %s", unusable.Fault, unusable.Detail)
}

func (unusable ImageUnusable) Unwrap() error {
	return unusable.Fault
}

// AssertImagePinned refuses an image the Docker daemon lacks or holds under another digest than the reference names;
// a reference matches the image's id or one of its repository digests. A daemon it cannot reach is named as that.
func (containers Containers) AssertImagePinned(ctx context.Context, reference string) error {
	image, err := containers.Daemon.ImageInspect(ctx, reference)
	if isAbsent(err) {
		return ImageUnusable{ErrImageAbsent, reference, "the image " + reference + " is not loaded into the Docker daemon"}
	}
	if err != nil {
		return ImageUnusable{ErrDaemonUnreachable, reference, err.Error()}
	}

	_, wanted, _ := strings.Cut(reference, "@")
	if slices.Contains(image.RepoDigests, reference) || (wanted != "" && image.ID == wanted) || image.ID == reference {
		return nil
	}

	return ImageUnusable{ErrDigestMismatch, reference, reference + " names " + wanted + ", but the daemon holds " + image.ID}
}

// AbsentImages are the images of the list the Docker daemon does not hold, in order; an image held under another
// digest, or a daemon it cannot reach, refuses the list as that image's fault.
func (containers Containers) AbsentImages(ctx context.Context, images []string) ([]string, error) {
	absent := []string{}
	for _, image := range images {
		err := containers.AssertImagePinned(ctx, image)
		if errors.Is(err, ErrImageAbsent) {
			absent = append(absent, image)
			continue
		}
		if err != nil {
			return nil, err
		}
	}
	return absent, nil
}

// aboutImage is a container's failure as its image's fault when the daemon could not be reached for it, so the journal
// hears which image the unreachable daemon was to run; any other failure is itself.
func aboutImage(image string, err error) error {
	var unusable ImageUnusable
	if !errors.Is(err, ErrDaemonUnreachable) || errors.As(err, &unusable) {
		return err
	}
	return ImageUnusable{ErrDaemonUnreachable, image, err.Error()}
}

// createFailure is the failure of a container's create: the image's own fault when the daemon lacks it or cannot be
// reached, otherwise that the container was not created.
func createFailure(image string, err error) error {
	if isAbsent(err) {
		return ImageUnusable{ErrImageAbsent, image, err.Error()}
	}
	if client.IsErrConnectionFailed(err) {
		return ImageUnusable{ErrDaemonUnreachable, image, err.Error()}
	}
	return fmt.Errorf("%w: %v", ErrContainerNotCreated, err)
}
