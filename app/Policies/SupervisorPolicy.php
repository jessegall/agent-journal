<?php

declare(strict_types=1);

namespace App\Policies;

use App\Access\Contracts\Policy;
use App\Access\Contracts\RestrictedPolicy;
use App\Agents\Enums\AccessType;
use App\Models\Asks\SupervisorLink;
use App\Profiles\Enums\ProfileAudience;

/**
 * Who may act on SupervisorLink records; the grant decides, and the handlers keep their own checks.
 */
final readonly class SupervisorPolicy implements RestrictedPolicy
{
    public static function model(): string
    {
        return SupervisorLink::class;
    }

    /**
     * Who among the built-in agent profiles may also be granted each access of this policy.
     */
    public static function additionalAudience(AccessType $access): ProfileAudience
    {
        return match ($access) {
            AccessType::Edit => ProfileAudience::Coordinator,
            default => ProfileAudience::Anyone,
        };
    }
}
