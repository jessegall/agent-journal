<?php

declare(strict_types=1);

namespace Domain\Tasks\Http\Pages\Tasks;

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
use App\Support\Layout\LayoutWaysData;
use App\Support\Layout\ListEmpty;
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
final readonly class TasksIndex
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

        return LayoutRowData::from(
            [
                'key' => $card->id,
                'label' => $card->title,
                'href' => route('tasks.task', ['task' => $card->number, ...$this->queryOf($filters)], false),
                'isCurrent' => $filters->task === (string) $card->number,
                'leading' => [LayoutPartData::text('number', (string) $card->number, 'muted')],
                'trailing' => [LayoutPartData::badge('state', $word, $tone)],
            ],
        );
    }

    private function choicesOf(TaskFiltersData $filters): LayoutPartData
    {
        $chosen = $filters->state instanceof TaskStateGroup ? $filters->state->value : '';

        $rows = [
            ...array_map(
                fn (TaskStateGroup $group) => LayoutRowData::from(
                    [
                        'key' => $group->value,
                        'label' => ucfirst($group->value),
                        'query' => ['state' => $group->value, 'page' => ''],
                        'isCurrent' => $chosen === $group->value,
                    ],
                ),
                TaskStateGroup::cases(),
            ),
            LayoutRowData::from(
                [
                    'key' => 'all',
                    'label' => 'All',
                    'query' => ['state' => '', 'page' => ''],
                    'isCurrent' => $chosen === '',
                ],
            ),
        ];

        return LayoutPartData::collection('states', 'choices', $rows);
    }

    private function emptyFor(TaskFiltersData $filters): ListEmpty
    {
        if ($filters->state instanceof TaskStateGroup || $filters->search !== '') {
            return ListEmpty::offering(
                'No task matches these filters.',
                LayoutPartData::action(
                    'clear',
                    'Show all tasks',
                    LayoutActionData::changing(['state' => '', 'q' => '', 'page' => '']),
                ),
            );
        }

        return ListEmpty::nothingYet(
            'No tasks yet',
            'A task is one piece of work an agent takes on, from start until it is tested.',
            'todos',
            $this->creation('first', 'primary'),
        );
    }

    /**
     * Create task: a dialog with Title and Done when, sent to the registered task creation, offering the guided entry
     * only when a draft producer is registered for tasks.
     */
    private function creation(string $key = 'creation', string $openerStyle = 'bordered'): LayoutPartData
    {
        $isGuided = $this->producers->offersGuided('task');

        $dialog = LayoutDialogData::from(
            [
                'title' => 'New task',
                'confirmation' => 'Task created',
                'guidedNoun' => $isGuided ? 'task' : Optional::create(),
                'ways' => $isGuided && $key === 'creation'
                    ? new LayoutWaysData('Write it yourself', 'Plan it with an agent')
                    : Optional::create(),
            ],
        );

        return LayoutPartData::dialog(
            $key,
            $dialog,
            LayoutPartData::action('open', 'New task', LayoutActionData::changing([]), $openerStyle),
            LayoutFormData::from(
                ['method' => ActionMethod::Post, 'href' => route('tasks.create-task', [], false), 'isKeyed' => true],
            ),
            [
                LayoutPartData::field('title', 'Title', new LayoutFieldData('title'), 'text'),
                LayoutPartData::field('brief', 'Done when', new LayoutFieldData('brief'), 'area'),
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
            'state' => $filters->state instanceof TaskStateGroup ? $filters->state->value : null,
            'q' => $filters->search === '' ? null : $filters->search,
            'page' => $filters->page > 1 ? $filters->page : null,
            'holder' => $filters->holder === TaskHolderFilter::Any ? null : $filters->holder->value,
        ], fn (mixed $value) => $value !== null);
    }
}
