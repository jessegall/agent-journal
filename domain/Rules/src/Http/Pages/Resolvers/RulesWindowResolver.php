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

        return DeclaredLayoutData::of(LayoutPartData::box(
            'rules',
            'stack',
            LayoutPartData::box(
                'top',
                'header',
                LayoutPartData::text('title', "Rules ({$page->total})", 'heading'),
                LayoutPartData::field(
                    'search',
                    'Search rules',
                    new LayoutFieldData('q', $filters->search, ['page', 'rule']),
                ),
            ),
            LayoutPartData::box(
                'split',
                'split',
                $this->listOf($page, is_string($selected) ? $selected : '', $filters->search),
                $this->readerOf($page),
            ),
        ));
    }

    /**
     * The page of rules; an empty one says why: no rule exists yet, or the search matches none, which it offers to
     * clear. Neither is a failure, so neither offers Retry, and the search stays above it.
     */
    private function listOf(RuleList $page, string $selected, string $search): LayoutPartData
    {
        if ($page->rules === [] && trim($search) === '') {
            return LayoutPartData::notice('list', 'empty', 'No rules yet.');
        }

        if ($page->rules === []) {
            return LayoutPartData::box(
                'list',
                'stack',
                LayoutPartData::notice('notice', 'empty', "No rules match \"{$search}\"."),
                LayoutPartData::action(
                    'clear',
                    'Clear search',
                    LayoutActionData::changing(['q' => '', 'page' => '', 'rule' => '']),
                ),
            );
        }

        $isAwaitingReview = array_any($page->rules, fn (RuleView $rule) => $rule->status === RuleStatus::Proposed);

        $rows = array_map(
            fn (RuleView $rule) => LayoutRowData::from(
                [
                    'key' => $rule->id,
                    'label' => $rule->text,
                    'value' => "{$rule->number} · {$rule->status->label()}",
                    'query' => ['rule' => $rule->id],
                    'isCurrent' => $rule->id === $selected,
                ],
            ),
            $page->rules,
        );

        $review = $isAwaitingReview
            ? []
            : [LayoutPartData::text('review', 'No rules awaiting review', 'muted')];

        return LayoutPartData::box(
            'list',
            'stack',
            ...$review,
            ...[LayoutPartData::collection('rows', 'list', $rows), $this->pagerOf($page)],
        );
    }

    private function pagerOf(RuleList $page): LayoutPartData
    {
        $controls = [LayoutPartData::text('page', "Page {$page->page} of {$page->lastPage}", 'muted')];

        if ($page->page > 1) {
            $controls[] = LayoutPartData::action(
                'previous',
                'Previous',
                LayoutActionData::changing(['page' => (string) ($page->page - 1)]),
            );
        }

        if ($page->page < $page->lastPage) {
            $controls[] = LayoutPartData::action(
                'next',
                'Next',
                LayoutActionData::changing(['page' => (string) ($page->page + 1)]),
            );
        }

        return LayoutPartData::box('pager', 'row', ...$controls);
    }

    private function readerOf(RuleList $page): LayoutPartData
    {
        $rule = $page->selection();

        if ($rule->isEmpty()) {
            if ($page->isSelectionMissing) {
                return LayoutPartData::notice('reader', 'empty', 'This rule does not exist.');
            }

            return LayoutPartData::notice('reader', 'empty', 'Choose a rule to read it.');
        }

        $shown = $rule->get();

        $parts = [
            LayoutPartData::box(
                'meta',
                'row',
                LayoutPartData::text('title', "Rule {$shown->number}", 'heading'),
                LayoutPartData::badge('state', $shown->status->label(), $shown->status->tone()),
            ),
            LayoutPartData::text('text', $shown->text, 'paragraph'),
        ];

        if ($shown->canReview) {
            $parts[] = $this->reviewOf($shown);
        }

        return LayoutPartData::box('reader', 'section', ...$parts);
    }

    /**
     * Approve and deny, each its own form on the rule's registered PATCH route; the server decides at write time
     * whether the rule may still be reviewed, and a rule settled meanwhile comes back as a refusal in place.
     */
    private function reviewOf(RuleView $rule): LayoutPartData
    {
        $review = fn (string $key, string $route, string $label, string $style) => LayoutPartData::form(
            $key,
            LayoutFormData::from(
                ['method' => ActionMethod::Patch, 'href' => route($route, ['rule' => $rule->number], false)],
            ),
            'inline',
            LayoutPartData::action('send', $label, LayoutActionData::submitting(), $style),
        );

        return LayoutPartData::box(
            'review',
            'row',
            $review('deny', 'rules.deny', 'Deny', 'bordered'),
            $review('approve', 'rules.approve', 'Approve', 'primary'),
        );
    }
}
