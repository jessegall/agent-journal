<?php

declare(strict_types=1);

namespace Domain\Rules\Contracts;

use Domain\Rules\Models\Rule;
use Domain\Rules\Values\RuleFilters;
use Domain\Rules\Values\RuleList;
use Illuminate\Database\Eloquent\Collection;

/**
 * One page of rules for whoever acts in this request, with the selected rule; every agent and the user read every rule.
 */
interface RuleResolver
{
    public const int PER_PAGE = RuleFilters::PAGE_SIZE;

    /**
     * The rules that match the filters.
     */
    public function list(RuleFilters $filters): RuleList;

    /** @return Collection<int, Rule> */
    public function preview(RuleFilters $filters, int $limit): Collection;
}
