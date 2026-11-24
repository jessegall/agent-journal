<?php

declare(strict_types=1);

namespace App\Support;

use App\Models\Profiles\ProfileRevision;
use App\Values\ProfileKey;
use App\Values\ProfileSnapshot;

/**
 * How a profile revision becomes the snapshot of its profile; kept out of the exported value.
 */
final readonly class ProfileSnapshots
{
    /**
     * A profile revision as the snapshot of the profile it belongs to.
     */
    public static function of(ProfileRevision $revision, ProfileKey $key): ProfileSnapshot
    {
        return ProfileSnapshot::from([
            'key' => $key,
            'revision' => $revision->revision,
            'base' => $revision->base,
            'instructions' => $revision->instructions,
            'preferredTier' => $revision->preferred_tier,
            'skillAllowlist' => $revision->skill_allowlist,
            'requiredSkills' => $revision->required_skills,
            'start' => $revision->start_policy,
            'authorization' => $revision->authorization,
            'supervisor' => $revision->supervisor,
            'instances' => $revision->instances,
        ]);
    }
}
