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
use Domain\Tasks\Contracts\AssignedTaskResolver;
use Domain\Tasks\Enums\TaskState;
use Domain\Tasks\Http\Data\AssignedTaskCardData;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsReadOnly;

/**
 * tasks_assigned: one numbered page of the tasks the caller holds, each with its assignment reference.
 */
#[IsReadOnly]
#[Name('tasks_assigned')]
#[Description('The tasks you hold, with the assignment reference each holds. Filter by search and states, page through with page and per_page (1 to 100, 20 unless given), or send only the continuation a result gave.')]
final class AssignedTasksTool extends JournalReadTool
{
    public function __construct(private readonly AssignedTaskResolver $tasks, private readonly NumberedPages $pages) {}

    public function schema(JsonSchema $schema): array
    {
        return [
            'search' => $schema->string()->max(240),
            'states' => $schema->array()->items($schema->string()->enum(array_column(TaskState::cases(), 'value'))),
            'page' => $schema->integer()->min(1),
            'per_page' => $schema->integer()->min(1)->max(NumberedPage::LARGEST_SIZE),
            'continuation' => $schema->string(),
        ];
    }

    protected function read(ToolArguments $arguments): ToolResult
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

    private function page(TaskFilters $filters): ListedPage
    {
        $list = $this->tasks->assignedToCaller($filters);
        $cards = [];

        foreach ($list->cards as $card) {
            $cards[$card->id] = AssignedTaskCardData::fromCard($card)->toArray();
        }

        return new ListedPage($cards, $list->page->number, $list->page->size, $list->total);
    }
}
