<?php

declare(strict_types=1);

namespace Domain\Rules\Http\Pages\Resolvers;

use App\Navigation\Contracts\PageResolver;
use App\Settings\Enums\ActionMethod;
use App\Support\Layout\DeclaredLayoutData;
use App\Support\Layout\LayoutActionData;
use App\Support\Layout\LayoutFieldData;
use App\Support\Layout\LayoutFormData;
use App\Support\Layout\LayoutPartData;
use App\Support\Layout\LayoutRowData;
use Domain\Rules\Contracts\RuleResolver;
use Domain\Rules\Enums\RuleStatus;
use Domain\Rules\Http\Requests\RulesRequest;
use Domain\Rules\Values\RuleList;
use Domain\Rules\Values\RuleView;

/**
 * The rules window, on Home and on its own page, declared as a layout: the search, one page of rules beside the
 * selected rule's reader with its review, and the pager. Every link changes only its own keys of the window's query.
 */
final readonly class RulesWindowResolver implements PageResolver
{
    public function __construct(
        private RulesRequest $request,
        private RuleResolver $records,
    ) {}

    public function read(): DeclaredLayoutData
    {
        $filters = $this->request->filters();
        $page = $this->records->list($filters->toDomain());
        $selected = $filters->onPage($page->page)->rule;

        return DeclaredLayoutData::build()
            ->root(
                LayoutPartData::build()
                ->asBox()
                ->key('rules')
                ->style('stack')
                ->children(
                    LayoutPartData::build()
                    ->asBox()
                    ->key('top')
                    ->style('header')
                    ->children(
                        LayoutPartData::build()
                        ->asText()
                        ->key('title')
                        ->value("Rules ({$page->total})")
                        ->style('heading')
                        ->finish(),
                        LayoutPartData::build()
                        ->asField()
                        ->key('search')
                        ->label('Search rules')
                        ->field(
                            LayoutFieldData::build()
                            ->name('q')
                            ->value($filters->search)
                            ->clears(['page', 'rule'])
                            ->finish(),
                        )
                        ->finish(),
                    )
                    ->finish(),
                    LayoutPartData::build()
                    ->asBox()
                    ->key('split')
                    ->style('split')
                    ->children(
                        $this->listOf($page, is_string($selected) ? $selected : '', $filters->search),
                        $this->readerOf($page),
                    )
                    ->finish(),
                )
                ->finish(),
            )
            ->finish();
    }

    /**
     * The page of rules; an empty one says why: no rule exists yet, or the search matches none, which it offers to
     * clear. Neither is a failure, so neither offers Retry, and the search stays above it.
     */
    private function listOf(RuleList $page, string $selected, string $search): LayoutPartData
    {
        if ($page->rules === [] && trim($search) === '') {
            return LayoutPartData::build()
                ->asNotice()
                ->key('list')
                ->style('empty')
                ->title('No rules yet.')
                ->finish();
        }

        if ($page->rules === []) {
            return LayoutPartData::build()
                ->asBox()
                ->key('list')
                ->style('stack')
                ->children(
                    LayoutPartData::build()
                    ->asNotice()
                    ->key('notice')
                    ->style('empty')
                    ->title("No rules match \"{$search}\".")
                    ->finish(),
                    LayoutPartData::build()
                    ->asAction()
                    ->key('clear')
                    ->label('Clear search')
                    ->action(
                        LayoutActionData::build()->query(['q' => '', 'page' => '', 'rule' => ''])->finish(),
                    )
                    ->finish(),
                )
                ->finish();
        }

        $isAwaitingReview = array_any($page->rules, fn (RuleView $rule) => $rule->status === RuleStatus::Proposed);

        $rows = array_map(
            fn (RuleView $rule) => LayoutRowData::build()
                ->key($rule->id)
                ->label($rule->text)
                ->value("{$rule->number} · {$rule->status->label()}")
                ->query(['rule' => $rule->id])
                ->isCurrent($rule->id === $selected)
                ->finish(),
            $page->rules,
        );

        $review = $isAwaitingReview
            ? []
            : [LayoutPartData::build()
                ->asText()
                ->key('review')
                ->value('No rules awaiting review')
                ->style('muted')
                ->finish()];

        return LayoutPartData::build()
            ->asBox()
            ->key('list')
            ->style('stack')
            ->children(
                ...$review,
                ...[LayoutPartData::build()->asCollection()->key('rows')->style('list')->rows($rows)->finish(), $this->pagerOf($page)],
            )
            ->finish();
    }

    private function pagerOf(RuleList $page): LayoutPartData
    {
        $controls = [LayoutPartData::build()
            ->asText()
            ->key('page')
            ->value("Page {$page->page} of {$page->lastPage}")
            ->style('muted')
            ->finish()];

        if ($page->page > 1) {
            $controls[] = LayoutPartData::build()
                ->asAction()
                ->key('previous')
                ->label('Previous')
                ->action(LayoutActionData::build()->query(['page' => (string) ($page->page - 1)])->finish())
                ->finish();
        }

        if ($page->page < $page->lastPage) {
            $controls[] = LayoutPartData::build()
                ->asAction()
                ->key('next')
                ->label('Next')
                ->action(LayoutActionData::build()->query(['page' => (string) ($page->page + 1)])->finish())
                ->finish();
        }

        return LayoutPartData::build()->asBox()->key('pager')->style('row')->children(...$controls)->finish();
    }

    private function readerOf(RuleList $page): LayoutPartData
    {
        $rule = $page->selection();

        if ($rule->isEmpty()) {
            if ($page->isSelectionMissing) {
                return LayoutPartData::build()
                    ->asNotice()
                    ->key('reader')
                    ->style('empty')
                    ->title('This rule does not exist.')
                    ->finish();
            }

            return LayoutPartData::build()
                ->asNotice()
                ->key('reader')
                ->style('empty')
                ->title('Choose a rule to read it.')
                ->finish();
        }

        $shown = $rule->get();

        $parts = [
            LayoutPartData::build()
                ->asBox()
                ->key('meta')
                ->style('row')
                ->children(
                    LayoutPartData::build()
                    ->asText()
                    ->key('title')
                    ->value("Rule {$shown->number}")
                    ->style('heading')
                    ->finish(),
                    LayoutPartData::build()
                    ->asBadge()
                    ->key('state')
                    ->text($shown->status->label())
                    ->tone($shown->status->tone())
                    ->finish(),
                )
                ->finish(),
            LayoutPartData::build()->asText()->key('text')->value($shown->text)->style('paragraph')->finish(),
        ];

        if ($shown->canReview) {
            $parts[] = $this->reviewOf($shown);
        }

        return LayoutPartData::build()->asBox()->key('reader')->style('section')->children(...$parts)->finish();
    }

    /**
     * Approve and deny, each its own form on the rule's registered PATCH route; the server decides at write time
     * whether the rule may still be reviewed, and a rule settled meanwhile comes back as a refusal in place.
     */
    private function reviewOf(RuleView $rule): LayoutPartData
    {
        $review = fn (string $key, string $route, string $label, string $style) => LayoutPartData::build()
            ->asForm()
            ->key($key)
            ->form(
                LayoutFormData::build()
                    ->method(ActionMethod::Patch)
                    ->href(route($route, ['rule' => $rule->number], false))
                    ->finish(),
            )
            ->style('inline')
            ->children(
                LayoutPartData::build()
                ->asAction()
                ->key('send')
                ->label($label)
                ->action(LayoutActionData::build()->submits(true)->finish())
                ->style($style)
                ->finish(),
            )
            ->finish();

        return LayoutPartData::build()
            ->asBox()
            ->key('review')
            ->style('row')
            ->children(
                $review('deny', 'rules.deny', 'Deny', 'bordered'),
                $review('approve', 'rules.approve', 'Approve', 'primary'),
            )
            ->finish();
    }
}
