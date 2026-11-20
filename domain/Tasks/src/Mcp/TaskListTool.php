<?php

declare(strict_types=1);

namespace Domain\Tasks\Mcp;

use App\Assignments\Support\NumberedPage;
use App\Mcp\Contracts\NumberedPages;
use App\Mcp\Data\ToolResult;
use App\Mcp\Support\ListedPage;
use App\Mcp\Support\ToolArguments;
use App\Mcp\Tools\JournalReadTool;
use Domain\Tasks\Api\TaskFilters;
use Domain\Tasks\Enums\TaskState;
use App\Assignments\Support\AssignmentData;
use App\Assignments\Support\AssignmentHolder;
use Domain\Tasks\Api\TaskList;
use Domain\Tasks\Http\Data\TaskExecutionData;
use Illuminate\Contracts\JsonSchema\JsonSchema;

/** Reads a page of task cards, with the continuation of a shortened page. */
abstract class TaskListTool extends JournalReadTool
{
    public function __construct(private readonly NumberedPages $pages) {}

    final public function schema(JsonSchema $schema): array
    {
        return [
            'search' => $schema->string()->max(240),
            'states' => $schema->array()->items($schema->string()->enum(array_column(TaskState::cases(), 'value'))),
            'page' => $schema->integer()->min(1),
            'per_page' => $schema->integer()->min(1)->max(NumberedPage::LARGEST_SIZE),
            'continuation' => $schema->string(),
        ];
    }

    final protected function read(ToolArguments $arguments): ToolResult
    {
        return $this->pages->answer(
            $this->name(),
            $arguments,
            fn (ToolArguments $first) => [
                'search' => $first->textOr('search', ''),
                'states' => $first->enumValues('states', TaskState::class),
                'page' => $first->positiveIntegerOr('page', 1),
                'per_page' => $first->positiveIntegerOr('per_page', 20, NumberedPage::LARGEST_SIZE),
            ],
            fn (array $filters) => $this->page(new TaskFilters(
                search: $filters['search'],
                states: array_values(array_map(TaskState::from(...), $filters['states'])),
                page: new NumberedPage($filters['page'], $filters['per_page']),
            )),
        );
    }

    abstract protected function tasks(TaskFilters $filters): TaskList;

    private function page(TaskFilters $filters): ListedPage
    {
        $list = $this->tasks($filters);
        $cards = [];

        foreach ($list->cards as $card) {
            $cards[$card->id] = [
                'id' => $card->id,
                'title' => $card->title,
                'state' => $card->state->value,
                'holder' => $card->holder->map(
                    fn (AssignmentHolder $holder) => AssignmentData::ofHolder($holder)->toArray(),
                )->getOrElse(null),
                'execution' => $card->execution === null ? null : TaskExecutionData::fromExecution(
                    $card->execution,
                )->toArray(),
            ];
        }

        return new ListedPage($cards, $list->page->number, $list->page->size, $list->total);
    }
}
