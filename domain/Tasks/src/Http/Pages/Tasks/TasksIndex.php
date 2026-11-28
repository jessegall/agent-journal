<?php

declare(strict_types=1);

namespace Domain\Tasks\Http\Pages\Tasks;

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
use App\Support\Layout\EmptyListState;
use App\Support\Layout\ListPage;
use App\Support\Layout\ListPaging;
use Domain\Tasks\Contracts\TaskListResolver;
use Domain\Tasks\Data\TaskFiltersData;
use Domain\Tasks\Enums\TaskHolderFilter;
use Domain\Tasks\Enums\TaskStateGroup;
use Domain\Tasks\Values\TaskCard;
use Spatie\LaravelData\Optional;

/**
 * The tasks index as the shared list recipe: its header with the total, the search and Create task, the single-state
 * choices and All, the rows with the number first and the state last, numbered paging and the empty states; a task
 * opened beside it fills the reader and Back leads to the list as it was, with its state, search and page.
 */
final readonly class TasksIndex extends TasksPage
{
    public function __construct(
        private TaskListResolver $tasks,
        private DraftProducers $producers,
        private ProjectField $projectField,
        private ProjectRowLabel $projectLabel,
    ) {}

    /**
     * @param  list<LayoutPartData>  $reader  the opened task's reader, none for the index address
     */
    public function of(TaskFiltersData $filters, array $reader): DeclaredLayoutData
    {
        $page = $this->tasks->list($filters->toDomain());
        $settled = $filters->onPage($page->page->number);

        $list = ListPage::build()
            ->title('Tasks')
            ->rows($page->cards, fn (TaskCard $card) => $this->rowOf($card, $settled))
            ->empty($this->emptyFor($settled))
            ->counting($page->total)
            ->filteredBy($this->choicesOf($settled))
            ->creatingWith($this->creation())
            ->paged(ListPaging::build()
                ->page($page->page->number)
                ->lastPage(max(1, (int) ceil($page->total / $page->page->size)))
                ->finish())
            ->withReader(LayoutBackData::build()->href($this->addressOf($settled))->label('Tasks')->finish(), ...$reader);

        return $list->finish();
    }

    private function rowOf(TaskCard $card, TaskFiltersData $filters): LayoutRowData
    {
        [$word, $tone] = $card->status->badge();

        return LayoutRowData::build()
            ->key($card->id)
            ->label($card->title)
            ->href(route('tasks.task', ['task' => $card->number, ...$this->queryOf($filters)], false))
            ->isCurrent($filters->task === (string) $card->number)
            ->leading(
                [LayoutPartData::build()
                ->asText()
                ->key('number')
                ->value((string) $card->number)
                ->style('muted')
                ->finish()],
            )
            ->trailing(
                [
                    ...$this->focusBadgeOf($card),
                    ...$this->projectLabel->partsFor($card->owner),
                    LayoutPartData::build()->asBadge()->key('state')->text($word)->tone($tone)->finish(),
                ],
            )
            ->finish();
    }

    /**
     * The badge naming the agent whose focus the task is in; none when no agent has it in focus.
     *
     * @return list<LayoutPartData>
     */
    private function focusBadgeOf(TaskCard $card): array
    {
        if ($card->execution === null) {
            return [];
        }

        return $card->execution->focusedBy
            ->map(fn (string $agent) => [LayoutPartData::build()
                ->asBadge()
                ->key('focus')
                ->text("In focus of {$agent}")
                ->tone('quiet')
                ->finish()])
            ->getOrElse([]);
    }

    private function choicesOf(TaskFiltersData $filters): LayoutPartData
    {
        $chosen = $filters->state instanceof TaskStateGroup ? $filters->state->value : '';

        $rows = [
            ...array_map(
                fn (TaskStateGroup $group) => LayoutRowData::build()
                    ->key($group->value)
                    ->label(ucfirst($group->value))
                    ->query(['state' => $group->value, 'page' => ''])
                    ->isCurrent($chosen === $group->value)
                    ->finish(),
                TaskStateGroup::cases(),
            ),
            LayoutRowData::build()
                ->key('all')
                ->label('All')
                ->query(['state' => '', 'page' => ''])
                ->isCurrent($chosen === '')
                ->finish(),
        ];

        return LayoutPartData::build()->asCollection()->key('states')->style('choices')->rows($rows)->finish();
    }

    private function emptyFor(TaskFiltersData $filters): EmptyListState
    {
        if ($filters->state instanceof TaskStateGroup || $filters->search !== null) {
            return $this->nothingMatches(
                'No task matches these filters.',
                'Show all tasks',
                ['state' => '', 'q' => '', 'page' => ''],
            );
        }

        return EmptyListState::build()
            ->title('No tasks yet')
            ->detail('A task is one piece of work an agent takes on, from start until it is tested.')
            ->icon('todos')
            ->actions([$this->creation('first', 'primary')])
            ->fillsPage(true)
            ->finish();
    }

    /**
     * Create task: a dialog with Title and Done when, sent to the registered task creation, offering the guided entry
     * only when a draft producer is registered for tasks.
     */
    private function creation(string $key = 'creation', string $openerStyle = 'bordered'): LayoutPartData
    {
        $creation = CreationDialog::build()
            ->key($key)
            ->title('New task')
            ->confirmation('Task created')
            ->sendLabel('Create task')
            ->guidedNoun($this->producers->offersGuided('task') ? 'task' : Optional::create())
            ->guidedWay('Plan it with an agent')
            ->waysInHeader($key === 'creation')
            ->finish();

        return $this->creationDialog(
            $creation,
            LayoutPartData::build()
                ->asAction()
                ->key('open')
                ->label('New task')
                ->action(LayoutActionData::build()->query([])->finish())
                ->style($openerStyle)
                ->finish(),
            LayoutFormData::build()
                ->method(ActionMethod::Post)
                ->href(route('tasks.create-task', [], false))
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
                    ->label('Done when')
                    ->field(LayoutFieldData::build()->name('brief')->finish())
                    ->style('area')
                    ->finish(),
                ...$this->projectField->forProject(),
            ],
        );
    }

    /**
     * The list's address with the state, search and page it had, which a task opened from it carries back.
     */
    private function addressOf(TaskFiltersData $filters): string
    {
        return route('tasks.list', $this->queryOf($filters), false);
    }

    /**
     * @return array<string, string|int>
     */
    private function queryOf(TaskFiltersData $filters): array
    {
        return array_filter([
            'state' => $filters->state instanceof TaskStateGroup ? $filters->state->value : null,
            'q' => $filters->search,
            'page' => $filters->page > 1 ? $filters->page : null,
            'holder' => $filters->holder === TaskHolderFilter::Any ? null : $filters->holder->value,
        ], fn (mixed $value) => $value !== null);
    }
}
