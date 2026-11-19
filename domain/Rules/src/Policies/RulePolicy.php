<?php

declare(strict_types=1);

namespace Domain\Rules\Policies;

use App\Actors\Contracts\Actor;
use App\Actors\Contracts\Policy;
use BackedEnum;

/**
 * Who may propose and review rules: the grants decide; that nobody approves their own proposal is the rule's own
 * invariant, for every actor.
 */
final readonly class RulePolicy implements Policy
{
    /**
     * @param  object|class-string  $subject
     */
    public function authorize(Actor $actor, object|string $subject, BackedEnum $ability): void {}
}
