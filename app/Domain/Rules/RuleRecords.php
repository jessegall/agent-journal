<?php

declare(strict_types=1);

namespace App\Domain\Rules;

use App\Domain\Rules\Models\Rule;

/**
 * The named reads of rules for a page, newest first. Every agent and the owner read every rule.
 */
final readonly class RuleRecords
{
    public const int PER_PAGE = 30;

    /**
     * @return list<Rule>
     */
    public function all(): array
    {
        return array_values(Rule::query()->orderByDesc('id')->get()->all());
    }

    public function list(RuleFilters $filters): RuleList
    {
        $total = Rule::query()->matching($filters->search)->count();
        $lastPage = max(1, (int) ceil($total / self::PER_PAGE));
        $page = min(max(1, $filters->page), $lastPage);
        $rules = Rule::query()->matching($filters->search)->orderByDesc('id')->forPage($page, self::PER_PAGE)->get();
        $selected = $filters->selectedRuleId === null ? null : Rule::query()->find($filters->selectedRuleId);

        return new RuleList(
            array_values($rules->all()),
            $page,
            $lastPage,
            $total,
            $selected,
            $filters->selectedRuleId !== null && $selected === null,
        );
    }
}
