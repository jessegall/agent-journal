<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Pages\Plans;

use App\Http\Pages\CreationDialog;
use App\Navigation\Contracts\DraftProducers;
use App\Settings\Enums\ActionMethod;
use App\Support\Layout\Contracts\ProjectField;
use App\Support\Layout\Contracts\ProjectRowLabel;
use App\Support\Layout\DeclaredLayoutData;
use App\Support\Layout\LayoutActionData;
use App\Support\Layout\LayoutBackData;
use App\Support\Layout\LayoutFieldData;
use App\Support\Layout\LayoutFormData;
use App\Support\Layout\LayoutPartData;
use App\Support\Layout\LayoutRowData;
use App\Support\Layout\ListEmpty;
use App\Support\Layout\ListPage;
use App\Support\Layout\ListPaging;
use App\Web\Enums\ReaderWidth;
use Domain\Plans\Contracts\PlanResolver;
use Domain\Plans\Data\PlanCardData;
use Domain\Plans\Data\PlanFiltersData;
use Domain\Plans\Enums\PlanStateGroup;
use Domain\Plans\Enums\PlanStatus;
use Domain\Plans\Enums\PlanType;
use Domain\Plans\Values\PlanCard;
use Spatie\LaravelData\Optional;

/**
 * The plans index as the shared list recipe: its header with the total, the search and Create plan, the state views,
 * the rows with each plan's counted progress and its cancelled state apart from the counts, numbered paging and the
 * empty states; a plan or a task opened beside it fills the reader, and Back leads to the list as it was.
 */
final readonly class PlansIndex extends PlansPage
{
    public function __construct(
        private PlanResolver $plans,
        private DraftProducers $producers,
        private ProjectField $projectField,
        private ProjectRowLabel $projectLabel,
    ) {}

    /**
     * @param  list<LayoutPartData>  $reader  the opened plan or task, none for the index address
     */
    public function of(PlanFiltersData $filters, array $reader): DeclaredLayoutData
    {
        $page = $this->plans->list($filters->toDomain());
        $settled = $filters->onPage($page->page);

        return ListPage::build()
            ->title('Plans')
            ->rows($page->cards, fn (PlanCard $card) => $this->rowOf($card, $settled))
            ->empty($this->emptyFor($settled))
            ->counting($page->total)
            ->creatingWith($this->creation())
            ->paged(ListPaging::build()->page($page->page)->lastPage(max(1, $page->lastPage))->finish())
            ->withReader(LayoutBackData::build()
                ->href(route('plans.list', $settled->toQuery(), false))
                ->label('Plans')
                ->finish(), ...$reader)
            ->withReaderWidth(ReaderWidth::Unrestricted)
            ->finish();
    }

    private function rowOf(PlanCard $plan, PlanFiltersData $filters): LayoutRowData
    {
        $card = PlanCardData::fromPlanCard($plan);
        $trailing = $this->projectLabel->partsFor($plan->owner);

        if ($card->status === PlanStatus::Cancelled) {
            $trailing[] = LayoutPartData::build()
                ->asBadge()
                ->key('state')
                ->text('Cancelled')
                ->tone('quiet')
                ->finish();
        }

        $trailing[] = $card->totalTasks === 0
            ? LayoutPartData::build()->asText()->key('progress')->value('No tasks')->style('muted')->finish()
            : LayoutPartData::build()
                ->asShare()
                ->key('progress')
                ->progress(
                    LayoutProgressData::build()
                    ->value($card->finishedTasks)
                    ->max($card->totalTasks)
                    ->label("Plan {$card->number}")
                    ->unit('tasks')
                    ->finish(),
                )
                ->finish();

        return LayoutRowData::build()
            ->key($card->id)
            ->label($card->title)
            ->href(route('plans.plan', ['plan' => $card->number, ...$filters->toQuery()], false))
            ->isCurrent($filters->plan === $card->number)
            ->leading(
                [LayoutPartData::build()
                ->asText()
                ->key('number')
                ->value($card->number)
                ->style('muted')
                ->finish()],
            )
            ->trailing($trailing)
            ->finish();
    }

    private function emptyFor(PlanFiltersData $filters): ListEmpty
    {
        if ($filters->state instanceof PlanStateGroup || $filters->search !== null) {
            return $this->nothingMatches(
                'No plan matches these filters.',
                'Show all plans',
                ['state' => '', 'q' => '', 'page' => ''],
            );
        }

        return ListEmpty::build()
            ->title('No plans yet')
            ->detail('A plan breaks bigger work into phases and tasks that agents can pick up.')
            ->icon('plan')
            ->actions([$this->creation('first', 'primary')])
            ->fillsPage(true)
            ->finish();
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
    private function creation(string $key = 'creation', string $openerStyle = 'bordered'): LayoutPartData
    {
        $creation = CreationDialog::build()
            ->key($key)
            ->title('New plan')
            ->confirmation('Plan created')
            ->sendLabel('Create plan')
            ->guidedNoun($this->producers->offersGuided('plan') ? 'plan' : Optional::create())
            ->guidedWay('Plan it with an agent')
            ->waysInHeader($key === 'creation')
            ->finish();

        return $this->creationDialog(
            $creation,
            LayoutPartData::build()
                ->asAction()
                ->key('open')
                ->label('New plan')
                ->action(LayoutActionData::build()->query([])->finish())
                ->style($openerStyle)
                ->finish(),
            LayoutFormData::build()
                ->method(ActionMethod::Post)
                ->href(route('plans.create-plan', [], false))
                ->isKeyed(true)
                ->finish(),
            [
                LayoutPartData::build()
                    ->asField()
                    ->key('title')
                    ->label('Title')
                    ->field(LayoutFieldData::build()->name('title')->finish())
                    ->style('text')
                    ->finish(),
                LayoutPartData::build()
                    ->asField()
                    ->key('brief')
                    ->label('Goal')
                    ->field(LayoutFieldData::build()->name('brief')->finish())
                    ->style('text')
                    ->finish(),
                LayoutPartData::build()
                    ->asField()
                    ->key('type')
                    ->label('Type')
                    ->field(LayoutFieldData::build()->name('type')->options($this->typeNames())->finish())
                    ->style('choice')
                    ->finish(),
                ...$this->projectField->forProject(),
            ],
        );
    }
}
