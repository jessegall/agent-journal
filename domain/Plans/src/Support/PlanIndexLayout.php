<?php

declare(strict_types=1);

namespace Domain\Plans\Support;

use App\Ui\Enums\ActionMethod;
use App\Ui\Enums\ReaderWidth;
use App\Ui\Layout\DeclaredLayoutData;
use App\Ui\Layout\LayoutActionData;
use App\Ui\Layout\LayoutBackData;
use App\Ui\Layout\LayoutDialogData;
use App\Ui\Layout\LayoutFieldData;
use App\Ui\Layout\LayoutFormData;
use App\Ui\Layout\LayoutPartData;
use App\Ui\Layout\LayoutRowData;
use App\Ui\Layout\ListEmpty;
use App\Ui\Layout\ListPage;
use App\Ui\Layout\ListPaging;
use App\Ui\Support\DraftProducerRegistry;
use Domain\Plans\Contracts\PlanResolver;
use Domain\Plans\Data\PlanCardData;
use Domain\Plans\Data\PlanFiltersData;
use Domain\Plans\Enums\PlanState;
use Domain\Plans\Enums\PlanStateGroup;
use Domain\Plans\Enums\PlanType;
use Spatie\LaravelData\Optional;

/**
 * The plans index as the shared list recipe: its header with the total, the search and Create plan, the state views,
 * the rows with each plan's counted progress and its cancelled state apart from the counts, numbered paging and the
 * empty states; a plan or a task opened beside it fills the reader, and Back leads to the list as it was.
 */
final readonly class PlanIndexLayout
{
    public function __construct(
        private PlanResolver $plans,
        private DraftProducerRegistry $producers,
    ) {}

    /**
     * @param  list<LayoutPartData>  $reader  the opened plan or task, none for the index address
     */
    public function of(PlanFiltersData $filters, array $reader): DeclaredLayoutData
    {
        $page = $this->plans->list($filters->toDomain());
        $settled = $filters->onPage($page->page);

        return ListPage::make(
            'Plans',
            array_map(fn ($card) => $this->rowOf(PlanCardData::fromPlanCard($card), $settled), $page->cards),
            $this->emptyFor($settled),
        )
            ->counting($page->total)
            ->searching('Search plans', new LayoutFieldData('q', $settled->search, ['page', 'plan']))
            ->filteredBy($this->choicesOf($settled))
            ->creatingWith($this->creation())
            ->paged(ListPaging::numbered($page->page, max(1, $page->lastPage)))
            ->withReader(new LayoutBackData(route('plans.list', $settled->toQuery(), false), 'Plans'), ...$reader)
            ->withReaderWidth(ReaderWidth::Unrestricted)
            ->layout();
    }

    private function rowOf(PlanCardData $card, PlanFiltersData $filters): LayoutRowData
    {
        $isCancelled = $card->state === PlanState::Cancelled;

        return new LayoutRowData(
            $card->id,
            $card->title,
            detail: $this->countsOf($card),
            href: route('plans.plan', ['plan' => $card->number, ...$filters->toQuery()], false),
            isCurrent: $filters->plan === $card->number,
            leading: [LayoutPartData::text('number', $card->number, 'muted')],
            trailing: [
                ...($isCancelled ? [LayoutPartData::badge('state', 'Cancelled', 'quiet')] : []),
                $card->totalTasks === 0
                    ? LayoutPartData::text('progress', 'No tasks', 'muted')
                    : LayoutPartData::progress(
                        'progress',
                        $card->finishedTasks,
                        $card->totalTasks,
                        "Plan {$card->number}",
                        'tasks',
                        true,
                    ),
            ],
        );
    }

    /**
     * The counts in words: finished of the total and how many were cancelled.
     */
    private function countsOf(PlanCardData $card): string
    {
        return $card->totalTasks === 0
            ? 'No tasks'
            : "{$card->finishedTasks} of {$card->totalTasks} finished, {$card->cancelledTasks} cancelled";
    }

    private function choicesOf(PlanFiltersData $filters): LayoutPartData
    {
        $chosen = $filters->state instanceof PlanStateGroup ? $filters->state->value : '';

        return LayoutPartData::collection('states', 'choices', [
            new LayoutRowData('all', 'All', query: ['state' => '', 'page' => ''], isCurrent: $chosen === ''),
            ...array_map(fn (PlanStateGroup $group) => new LayoutRowData(
                $group->value,
                ucfirst($group->value),
                query: ['state' => $group->value, 'page' => ''],
                isCurrent: $chosen === $group->value,
            ), PlanStateGroup::cases()),
        ]);
    }

    private function emptyFor(PlanFiltersData $filters): ListEmpty
    {
        if ($filters->state instanceof PlanStateGroup || $filters->search !== '') {
            return ListEmpty::offering(
                'No plan matches these filters.',
                LayoutPartData::action(
                    'clear',
                    'Show all plans',
                    LayoutActionData::changing(['state' => '', 'q' => '', 'page' => '']),
                ),
            );
        }

        return ListEmpty::offering('No plans yet.', $this->creation('create-first'));
    }

    /**
     * @return list<string>
     */
    private function typeNames(): array
    {
        return array_map(fn (PlanType $type) => $type->value, PlanType::cases());
    }

    /**
     * Create plan: a dialog with Title, Goal and a required Type from the permitted types, sent to the registered plan
     * creation; plan assignment, dependencies and phases are left out until authorized operations exist.
     */
    private function creation(string $key = 'creation'): LayoutPartData
    {
        return LayoutPartData::dialog(
            $key,
            new LayoutDialogData(
                'Create plan',
                'Plan created',
                guidedNoun: $this->producers->offersGuided('plan') ? 'plan' : new Optional(),
            ),
            LayoutPartData::action('open', 'Create plan', LayoutActionData::changing([]), 'primary'),
            new LayoutFormData(ActionMethod::Post, route('plans.create-plan', [], false), isKeyed: true),
            [
                LayoutPartData::field('title', 'Title', new LayoutFieldData('title'), 'text'),
                LayoutPartData::field('brief', 'Goal', new LayoutFieldData('brief'), 'text'),
                LayoutPartData::field(
                    'type',
                    'Type',
                    new LayoutFieldData('type', '', [], $this->typeNames()),
                    'choice',
                ),
            ],
            [LayoutPartData::action('send', 'Create plan', LayoutActionData::submitting(), 'primary')],
        );
    }
}
