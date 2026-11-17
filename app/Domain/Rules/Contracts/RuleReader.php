<?php

declare(strict_types=1);

namespace App\Domain\Rules\Contracts;

use App\Domain\Rules\Api\RuleFilters;
use App\Domain\Rules\Api\RuleList;
use App\Domain\Rules\RuleRecords;
use Illuminate\Container\Attributes\Bind;

/**
 * One page of rules for whoever acts in this request, with the selected rule; every agent and the user read every rule.
 */
#[Bind(RuleRecords::class)]
interface RuleReader
{
    public function list(RuleFilters $filters): RuleList;
}
