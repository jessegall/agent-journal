<?php

declare(strict_types=1);

namespace Domain\Rules\Contracts;

use Domain\Rules\Api\RuleFilters;
use Domain\Rules\Api\RuleList;

/**
 * One page of rules for whoever acts in this request, with the selected rule; every agent and the user read every rule.
 */
interface RuleResolver
{
    public const int PER_PAGE = 30;

    public function list(RuleFilters $filters): RuleList;
}
