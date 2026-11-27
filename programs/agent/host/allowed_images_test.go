package host

import "testing"

const (
	allowedDigest = "registry.example/agent@sha256:aaaa"
	otherDigest   = "registry.example/agent@sha256:bbbb"
)

func TestAContainedHostRunsOnlyTheImagesTheJournalAllowed(t *testing.T) {
	rules := ContainerRules{Arrangement: Contained, Allowed: NewAllowedImages()}

	before := rules.permitsImage(allowedDigest)
	rules.Allowed.Replace([]string{allowedDigest})

	if before || !rules.permitsImage(allowedDigest) || rules.permitsImage(otherDigest) {
		t.Fatalf("permitted before any instruction: %v, the allowed digest: %v, another: %v",
			before, rules.permitsImage(allowedDigest), rules.permitsImage(otherDigest))
	}
}

func TestAReplacedSetNoLongerPermitsTheImagesBeforeIt(t *testing.T) {
	rules := ContainerRules{Arrangement: Contained, Allowed: NewAllowedImages()}
	rules.Allowed.Replace([]string{allowedDigest})

	rules.Allowed.Replace([]string{otherDigest})

	if rules.permitsImage(allowedDigest) || !rules.permitsImage(otherDigest) {
		t.Fatal("the replaced set still permits the image it no longer names")
	}
}

func TestALocalHostRunsAnyImageAndAContainedOneWithNoSetNone(t *testing.T) {
	local := ContainerRules{Arrangement: Local}
	contained := ContainerRules{Arrangement: Contained}

	if !local.permitsImage(otherDigest) || contained.permitsImage(allowedDigest) {
		t.Fatal("a local host refused an image, or a contained host with no set permitted one")
	}
}

func TestAContainedHostAllowsAProbeThatMountsNothingButNotMoreMountsThanItsTargets(t *testing.T) {
	rules := ContainerRules{Arrangement: Contained, InstallationName: "journal"}
	tooMany := make([]ContainerMount, mostContainedMounts+1)

	if !rules.permit(nil) || rules.permit(tooMany) {
		t.Fatalf("a probe with no mount was refused (%v) or more mounts than targets allowed", rules.permit(nil))
	}
}
