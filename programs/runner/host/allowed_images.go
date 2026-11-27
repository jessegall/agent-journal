package host

import "sync"

// AllowedImages are the pinned images the journal last named that a contained host's containers may run: none until
// its first allow_images instruction, so a host that just started runs no container of its own choice.
type AllowedImages struct {
	mutex   sync.RWMutex
	digests map[string]bool
}

// NewAllowedImages is the empty set of a host that just started.
func NewAllowedImages() *AllowedImages {
	return &AllowedImages{digests: map[string]bool{}}
}

// Replace makes the images named the only ones a container may run.
func (allowed *AllowedImages) Replace(images []string) {
	digests := make(map[string]bool, len(images))
	for _, image := range images {
		digests[image] = true
	}
	allowed.mutex.Lock()
	defer allowed.mutex.Unlock()
	allowed.digests = digests
}

// Permits answers whether a container may run the image; a host with no set permits none.
func (allowed *AllowedImages) Permits(image string) bool {
	if allowed == nil {
		return false
	}
	allowed.mutex.RLock()
	defer allowed.mutex.RUnlock()

	return allowed.digests[image]
}
