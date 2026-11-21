<?php

declare(strict_types=1);

namespace Domain\Rules\Resolvers;

use App\Ui\Contracts\PageResolver;
use App\Ui\Enums\ActionMethod;
use App\Ui\Layout\DeclaredLayoutData;
use App\Ui\Layout\LayoutActionData;
use App\Ui\Layout\LayoutFieldData;
use App\Ui\Layout\LayoutFormData;
use App\Ui\Layout\LayoutPartData;
use App\Ui\Layout\LayoutRowData;
use Domain\Rules\Api\RuleList;
use Domain\Rules\Api\RuleView;
use Domain\Rules\Contracts\RuleResolver;
use Domain\Rules\Http\Requests\RulesRequest;

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
                $this->listOf($page, is_string($selected) ? $selected : ''),
                $this->readerOf($page),
            ),
        ));
    }

    private function listOf(RuleList $page, string $selected): LayoutPartData
    {
        if ($page->rules === []) {
            return LayoutPartData::notice('list', 'empty', 'No rules match these filters.');
        }

        $rows = array_map(fn (RuleView $rule) => new LayoutRowData(
            $rule->id,
            $rule->text,
            "{$rule->number} · {$rule->state->label()}",
            ['rule' => $rule->id],
            $rule->id === $selected,
        ), $page->rules);

        return LayoutPartData::box(
            'list',
            'stack',
            LayoutPartData::collection('rows', 'list', $rows),
            $this->pagerOf($page),
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
            return $page->selectionMissing
                ? LayoutPartData::notice('reader', 'empty', 'This rule does not exist.')
                : LayoutPartData::notice('reader', 'empty', 'Choose a rule to read it.');
        }

        $shown = $rule->get();

        $parts = [
            LayoutPartData::box(
                'meta',
                'row',
                LayoutPartData::text('title', "Rule {$shown->number}", 'heading'),
                LayoutPartData::badge('state', $shown->state->label(), $shown->state->tone()),
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
            new LayoutFormData(ActionMethod::Patch, route($route, ['rule' => $rule->number], false)),
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
