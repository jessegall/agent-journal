<?php

declare(strict_types=1);

namespace Domain\Rules\Policies;

use App\Access\Contracts\Policy;
use App\Access\Contracts\RestrictedPolicy;
use App\Agents\Enums\AccessType;
use App\Profiles\Enums\ProfileAudience;
use Domain\Rules\Models\Rule;

/**
 * Who may propose and review rules: the grants decide; that nobody approves their own proposal is the rule's own
 * invariant, for every actor.
 */
final readonly class RulePolicy implements RestrictedPolicy
{
    public static function model(): string
    {
        return Rule::class;
    }

    /**
     * Who among the built-in agent profiles may also be granted each access of this policy.
     */
    public static function additionalAudience(AccessType $access): ProfileAudience
    {
        return match ($access) {
            AccessType::Edit, AccessType::Delete => ProfileAudience::Owner,
            default => ProfileAudience::Anyone,
        };
    }
}
