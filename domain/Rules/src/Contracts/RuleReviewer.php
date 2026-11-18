<?php

declare(strict_types=1);

namespace Domain\Rules\Contracts;

use Domain\Rules\Actions\ReviewRule;
use Domain\Rules\Exceptions\RuleMissing;
use Domain\Rules\Exceptions\RuleNotProposed;
use Illuminate\Container\Attributes\Bind;

/**
 * Approves or denies a proposed rule by its id, once, under the rule's row lock; only the user may.
 */
#[Bind(ReviewRule::class)]
interface RuleReviewer
{
    /**
     * @throws RuleMissing
     * @throws RuleNotProposed
     */
    public function approve(int $ruleId): void;

    /**
     * @throws RuleMissing
     * @throws RuleNotProposed
     */
    public function deny(int $ruleId): void;
}
