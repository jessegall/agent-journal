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

/**
 * Reads a page of task cards, with the continuation of a shortened page.
 */
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
            fn (ToolArguments $initialArguments) => [
                'search' => $initialArguments->textOr('search', ''),
                'states' => $initialArguments->enumValues('states', TaskState::class),
                'page' => $initialArguments->positiveIntegerOr('page', 1),
                'per_page' => $initialArguments->positiveIntegerOr('per_page', 20, NumberedPage::LARGEST_SIZE),
            ],
            fn (ToolArguments $filters) => $this->page(new TaskFilters(
                search: $filters->text('search'),
                states: array_map(TaskState::from(...), $filters->list('states')),
                page: new NumberedPage($filters->positiveInteger('page'), $filters->positiveInteger('per_page')),
            )),
        );
    }

    abstract protected function tasks(TaskFilters $filters): TaskList;

    private function page(TaskFilters $filters): ListedPage
    {
        $taskPage = $this->tasks($filters);
        $cards = [];

        foreach ($taskPage->cards as $card) {
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

        return new ListedPage($cards, $taskPage->page->number, $taskPage->page->size, $taskPage->total);
    }
}
