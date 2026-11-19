<?php

declare(strict_types=1);

namespace Domain\Rules\Contracts;

use Domain\Rules\Api\RuleDetails;
use Domain\Rules\Exceptions\RuleMissing;
use Domain\Rules\Resolvers\RuleDetailRecords;
use Illuminate\Container\Attributes\Bind;

/**
 * One rule for whoever acts in this request; every actor reads every rule.
 */
#[Bind(RuleDetailRecords::class)]
interface RuleDetailsResolver
{
    /**
     * @throws RuleMissing
     */
    public function rule(string $ruleId): RuleDetails;

    /**
     * How many rules hold now.
     */
    public function activeCount(): int;
}
