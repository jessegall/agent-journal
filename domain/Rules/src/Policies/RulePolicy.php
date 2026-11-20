<?php

declare(strict_types=1);

namespace Domain\Rules\Policies;

use App\Actors\Contracts\Policy;
use Domain\Rules\Models\Rule;

/**
 * Who may propose and review rules: the grants decide; that nobody approves their own proposal is the rule's own
 * invariant, for every actor.
 */
final readonly class RulePolicy implements Policy
{
    public static function model(): string
    {
        return Rule::class;
    }
}
