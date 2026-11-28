<?php

declare(strict_types=1);

namespace Domain\Rules\Resolvers;

use App\Actors\Contracts\CurrentActor;
use App\Support\Layout\LayoutRowData;
use App\Support\NumberedPage;
use App\Web\Values\PaneExcerpt;
use Domain\Rules\Contracts\RuleResolver as RuleResolverContract;
use Domain\Rules\Models\Rule;
use Domain\Rules\Values\RuleFilters;
use Domain\Rules\Values\RuleList;
use Domain\Rules\Values\RuleView;
use Illuminate\Container\Attributes\Scoped;
use Illuminate\Database\Eloquent\Builder;
use PhpOption\None;
use PhpOption\Option;

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
            Rule::query()->newestFirst()->get()->all(),
        );
    }

    public function list(RuleFilters $filters): RuleList
    {
        $matching = $this->matching($filters);
        $total = (clone $matching)->count();
        $size = min(max(1, $filters->perPage), NumberedPage::LARGEST_SIZE);
        $lastPage = max(1, (int) ceil($total / $size));
        $page = min(max(1, $filters->page), $lastPage);
        $rules = $matching->orderByDesc('id')->forPage($page, $size)->get();
        $selected = self::selectedOf($filters);

        return new RuleList(
            array_values($rules->map(self::viewOf(...))->all()),
            $page,
            $lastPage,
            $total,
            $selected->map(self::viewOf(...))->getOrElse(null),
            $filters->selectedRuleId !== null && $selected->isEmpty(),
        );
    }

    /** @return list<LayoutRowData> */
    public function preview(RuleFilters $filters, int $limit): array
    {
        $records = $this->matching($filters)->orderByDesc('id')->limit($limit)->get(['id', 'number', 'text']);

        return array_values($records->map(fn (Rule $rule) => LayoutRowData::build()
            ->key($rule->id)
            ->label(PaneExcerpt::of($rule->text))
            ->value("Rule {$rule->number}")
            ->finish())->all());
    }

    /** @return Builder<Rule> */
    private function matching(RuleFilters $filters): Builder
    {
        $this->actors->actor();
        $matching = Rule::query()->matching($filters->search);

        if ($filters->status !== null) {
            $matching->where('status', $filters->status);
        }

        return $matching;
    }

    /**
     * The rule the filters select, none when they select none or it is gone.
     *
     * @return Option<Rule>
     */
    private static function selectedOf(RuleFilters $filters): Option
    {
        if ($filters->selectedRuleId === null) {
            return None::create();
        }

        $rule = Rule::query()->find($filters->selectedRuleId);

        return Option::fromValue($rule);
    }

    private static function viewOf(Rule $rule): RuleView
    {
        return new RuleView($rule->id, $rule->number, $rule->text, $rule->status, $rule->canBeReviewed());
    }
}
