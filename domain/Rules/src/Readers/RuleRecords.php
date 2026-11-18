<?php

declare(strict_types=1);

namespace Domain\Rules\Readers;

use App\Actors\Contracts\CurrentActor;
use Domain\Rules\Api\RuleFilters;
use Domain\Rules\Api\RuleList;
use Domain\Rules\Api\RuleView;
use Domain\Rules\Contracts\RuleReader;
use Domain\Rules\Models\Rule;
use Illuminate\Container\Attributes\Scoped;

/**
 * The named reads of rules, newest first, for whoever acts in this request; every agent and the user read every rule.
 * all() is for Rules itself and hands out models; list() hands out RuleView values.
 */
#[Scoped]
final readonly class RuleRecords implements RuleReader
{
    public const int PER_PAGE = 30;

    public function __construct(private CurrentActor $actors) {}

    /**
     * @return list<Rule>
     */
    public function all(): array
    {
        return array_values(Rule::query()->orderByDesc('id')->get()->all());
    }

    public function list(RuleFilters $filters): RuleList
    {
        $this->actors->actor();
        $total = Rule::query()->matching($filters->search)->count();
        $lastPage = max(1, (int) ceil($total / self::PER_PAGE));
        $page = min(max(1, $filters->page), $lastPage);
        $rules = Rule::query()->matching($filters->search)->orderByDesc('id')->forPage($page, self::PER_PAGE)->get();
        $selected = $filters->selectedRuleId === null ? null : Rule::query()->find($filters->selectedRuleId);

        return new RuleList(
            array_values($rules->map(self::viewOf(...))->all()),
            $page,
            $lastPage,
            $total,
            $selected === null ? null : self::viewOf($selected),
            $filters->selectedRuleId !== null && $selected === null,
        );
    }

    private static function viewOf(Rule $rule): RuleView
    {
        return new RuleView($rule->id, $rule->text, $rule->state, $rule->canBeReviewed());
    }
}
