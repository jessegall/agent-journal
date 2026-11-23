<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Pages\Plans;

use App\Contracts\Navigation\DraftProducers;
use App\Enums\ActionMethod;
use App\Support\Layout\DeclaredLayoutData;
use App\Support\Layout\LayoutActionData;
use App\Support\Layout\LayoutBackData;
use App\Support\Layout\LayoutDialogData;
use App\Support\Layout\LayoutFieldData;
use App\Support\Layout\LayoutFormData;
use App\Support\Layout\LayoutPartData;
use App\Support\Layout\LayoutRowData;
use App\Support\Layout\ListEmpty;
use App\Support\Layout\ListPage;
use App\Support\Layout\ListPaging;
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
final readonly class PlansIndex
{
    public function __construct(
        private PlanResolver $plans,
        private DraftProducers $producers,
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
            ->creatingWith($this->creation())
            ->paged(ListPaging::numbered($page->page, max(1, $page->lastPage)))
            ->withReader(new LayoutBackData(route('plans.list', $settled->toQuery(), false), 'Plans'), ...$reader)
            ->layout();
    }

    private function rowOf(PlanCardData $card, PlanFiltersData $filters): LayoutRowData
    {
        $trailing = [];

        if ($card->state === PlanState::Cancelled) {
            $trailing[] = LayoutPartData::badge('state', 'Cancelled', 'quiet');
        }

        $trailing[] = $card->totalTasks === 0
            ? LayoutPartData::text('progress', 'No tasks', 'muted')
            : LayoutPartData::progress('progress', $card->finishedTasks, $card->totalTasks, "Plan {$card->number}", 'tasks', true);

        return LayoutRowData::from([
            'key' => $card->id,
            'label' => $card->title,
            'href' => route('plans.plan', ['plan' => $card->number, ...$filters->toQuery()], false),
            'isCurrent' => $filters->plan === $card->number,
            'leading' => [LayoutPartData::text('number', $card->number, 'muted')],
            'trailing' => $trailing,
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

        return ListEmpty::informing('No plans yet.');
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
            LayoutDialogData::from(
                [
                    'title' => 'New plan',
                    'confirmation' => 'Plan created',
                    'guidedNoun' => $this->producers->offersGuided('plan') ? 'plan' : Optional::create(),
                ],
            ),
            LayoutPartData::action('open', 'New plan', LayoutActionData::changing([])),
            LayoutFormData::from(
                ['method' => ActionMethod::Post, 'href' => route('plans.create-plan', [], false), 'isKeyed' => true],
            ),
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
