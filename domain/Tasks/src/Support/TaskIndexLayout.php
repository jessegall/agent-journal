<?php

declare(strict_types=1);

namespace Domain\Tasks\Support;

use App\Ui\Contracts\DraftProducers;
use App\Ui\Enums\ActionMethod;
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
use Domain\Tasks\Api\TaskCard;
use Domain\Tasks\Contracts\TaskListResolver;
use Domain\Tasks\Enums\TaskHolderFilter;
use Domain\Tasks\Enums\TaskState;
use Domain\Tasks\Http\Data\TaskFiltersData;
use Spatie\LaravelData\Optional;

/**
 * The tasks index as the shared list recipe: its header with the total, the search and Create task, the single-state
 * choices and All, the rows with the number first and the state last, numbered paging and the empty states; a task
 * opened beside it fills the reader and Back leads to the list as it was, with its state, search and page.
 */
final readonly class TaskIndexLayout
{
    public function __construct(
        private TaskListResolver $tasks,
        private DraftProducers $producers,
    ) {}

    /**
     * @param  list<LayoutPartData>  $reader  the opened task's reader, none for the index address
     */
    public function of(TaskFiltersData $filters, array $reader): DeclaredLayoutData
    {
        $page = $this->tasks->list($filters->toDomain());
        $settled = $filters->onPage($page->page->number);

        $list = ListPage::make(
            'Tasks',
            array_map(fn (TaskCard $card) => $this->rowOf($card, $settled), $page->cards),
            $this->emptyFor($settled),
        )
            ->counting($page->total)
            ->searching('Search tasks', new LayoutFieldData('q', $settled->search, ['page', 'task']))
            ->filteredBy($this->choicesOf($settled))
            ->creatingWith($this->creation())
            ->paged(ListPaging::numbered(
                $page->page->number,
                max(1, (int) ceil($page->total / $page->page->size)),
            ))
            ->withReader(new LayoutBackData($this->addressOf($settled), 'Tasks'), ...$reader);

        return $list->layout();
    }

    private function rowOf(TaskCard $card, TaskFiltersData $filters): LayoutRowData
    {
        [$word, $tone] = $card->state->badge();

        return new LayoutRowData(
            $card->id,
            $card->title,
            href: route('tasks.task', ['task' => $card->number, ...$this->queryOf($filters)], false),
            isCurrent: $filters->task === (string) $card->number,
            leading: [LayoutPartData::text('number', (string) $card->number, 'muted')],
            trailing: [LayoutPartData::badge('state', $word, $tone)],
        );
    }

    private function choicesOf(TaskFiltersData $filters): LayoutPartData
    {
        $chosen = $filters->state instanceof TaskState ? $filters->state->value : '';

        $rows = [
            new LayoutRowData('all', 'All', query: ['state' => '', 'page' => ''], isCurrent: $chosen === ''),
            ...array_map(fn (TaskState $state) => new LayoutRowData(
                $state->value,
                $state->badge()[0],
                query: ['state' => $state->value, 'page' => ''],
                isCurrent: $chosen === $state->value,
            ), TaskState::cases()),
        ];

        return LayoutPartData::collection('states', 'choices', $rows);
    }

    private function emptyFor(TaskFiltersData $filters): ListEmpty
    {
        if ($filters->state instanceof TaskState || $filters->search !== '') {
            return ListEmpty::offering(
                'No task matches these filters.',
                LayoutPartData::action(
                    'clear',
                    'Show all tasks',
                    LayoutActionData::changing(['state' => '', 'q' => '', 'page' => '']),
                ),
            );
        }

        return ListEmpty::offering('No tasks yet.', $this->creation('create-first'));
    }

    /**
     * Create task: a dialog with Title and Done when, sent to the registered task creation, offering the guided entry
     * only when a draft producer is registered for tasks.
     */
    private function creation(string $key = 'creation'): LayoutPartData
    {
        $dialog = new LayoutDialogData(
            'Create task',
            'Task created',
            guidedNoun: $this->producers->offersGuided('task') ? 'task' : new Optional(),
        );

        return LayoutPartData::dialog(
            $key,
            $dialog,
            LayoutPartData::action('open', 'Create task', LayoutActionData::changing([]), 'primary'),
            new LayoutFormData(ActionMethod::Post, route('tasks.create-task', [], false), isKeyed: true),
            [
                LayoutPartData::field('title', 'Title', new LayoutFieldData('title'), 'text'),
                LayoutPartData::field('brief', 'Done when', new LayoutFieldData('brief'), 'text'),
            ],
            [LayoutPartData::action('send', 'Create task', LayoutActionData::submitting(), 'primary')],
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
            'state' => $filters->state instanceof TaskState ? $filters->state->value : null,
            'q' => $filters->search === '' ? null : $filters->search,
            'page' => $filters->page > 1 ? $filters->page : null,
            'holder' => $filters->holder === TaskHolderFilter::Any ? null : $filters->holder->value,
        ], fn (mixed $value) => $value !== null);
    }
}
