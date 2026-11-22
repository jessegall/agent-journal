<?php

declare(strict_types=1);

namespace Domain\Rules\Policies;

use App\Contracts\Policy;
use App\Contracts\RestrictedPolicy;
use App\Enums\AccessType;
use App\Enums\ProfileAudience;
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
