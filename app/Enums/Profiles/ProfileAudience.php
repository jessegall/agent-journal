<?php

declare(strict_types=1);

namespace App\Enums\Profiles;

/**
 * Which built-in agent profiles an access is for: anyone, the owner alone, a coordinating profile, or a profile that
 * may change its workspace.
 */
enum ProfileAudience: string
{
    case Anyone = 'anyone';
    case Owner = 'owner';
    case Coordinator = 'coordinator';
    case Writable = 'writable';

    /**
     * Whether a built-in agent profile of this kind may be granted the access.
     */
    public function admitsAgent(bool $isCoordinator, bool $isReadOnly): bool
    {
        return match ($this) {
            self::Anyone => true,
            self::Owner => false,
            self::Coordinator => $isCoordinator,
            self::Writable => ! $isReadOnly,
        };
    }
}
