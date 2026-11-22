<?php

declare(strict_types=1);

namespace App\Policies;

use App\Contracts\Policy;
use App\Contracts\RestrictedPolicy;
use App\Enums\AccessType;
use App\Enums\ProfileAudience;
use App\Models\SupervisorLink;

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
