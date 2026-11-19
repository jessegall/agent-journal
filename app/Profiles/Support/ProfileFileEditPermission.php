<?php

declare(strict_types=1);

namespace App\Profiles\Support;

use App\Actors\Contracts\CurrentActor;
use App\Hooks\Contracts\FileEditPermission;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use App\Profiles\Values\StartProfileAuthority;

/**
 * Reads the acting agent's pinned profile: it may change workspace files when its access grants editing them. An
 * actor acting without a profile, such as the owner, is not held to one.
 */
final readonly class ProfileFileEditPermission implements FileEditPermission
{
    public function __construct(private CurrentActor $actors) {}

    public function mayEditFiles(): bool
    {
        $authority = $this->actors->authority();

        if (! $authority instanceof StartProfileAuthority) {
            return true;
        }

        return $authority->profile->start->access->grants(AccessType::Edit, ResourceAreaType::Workspace);
    }
}
