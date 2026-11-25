<?php

declare(strict_types=1);

namespace Domain\Rules\Resolvers;

use App\Contracts\Actors\CurrentActor;
use App\Support\NumberedPage;
use Domain\Rules\Contracts\RuleResolver as RuleResolverContract;
use Domain\Rules\Models\Rule;
use Domain\Rules\Values\RuleFilters;
use Domain\Rules\Values\RuleList;
use Domain\Rules\Values\RuleView;
use Illuminate\Container\Attributes\Scoped;

/**
 * The named reads of rules, newest first, for whoever acts in this request; every agent and the user read every rule.
 * all() is for Rules itself and hands out models; list() hands out RuleView values.
 */
#[Scoped]
final readonly class RuleResolver implements RuleResolverContract
{
    public function __construct(private CurrentActor $actors) {}

    /**
     * @return list<Rule>
     */
    public function all(): array
    {
        return array_values(
            Rule::query()->newestFirst()->readAll('every rule, for a caller that lists them all')->get()->all(),
        );
    }

    public function list(RuleFilters $filters): RuleList
    {
        $this->actors->actor();
        $matching = Rule::query()->matching($filters->search);

        if ($filters->state !== null) {
            $matching->where('state', $filters->state);
        }

        $total = (clone $matching)->count();
        $size = min(max(1, $filters->perPage), NumberedPage::LARGEST_SIZE);
        $lastPage = max(1, (int) ceil($total / $size));
        $page = min(max(1, $filters->page), $lastPage);
        $rules = $matching->orderByDesc('id')->forPage($page, $size)->get();
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
        return new RuleView($rule->id, $rule->number, $rule->text, $rule->state, $rule->canBeReviewed());
    }
}
