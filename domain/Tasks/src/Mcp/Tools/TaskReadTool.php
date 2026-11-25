<?php

declare(strict_types=1);

namespace Domain\Tasks\Mcp\Tools;

use App\Enums\CommandRules\ReadView;
use App\Mcp\Data\ToolResult;
use App\Mcp\Support\ToolArguments;
use App\Mcp\Tools\JournalReadTool;
use App\Values\ReadRequest;
use Domain\Tasks\Support\Mcp\TaskReadResult;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsReadOnly;

#[IsReadOnly]
#[Name(TaskReadResult::TOOL)]
#[Description('Read a task summary or its context with the brief, result note, and reasons.')]
final class TaskReadTool extends JournalReadTool
{
    public function __construct(private readonly TaskReadResult $tasks) {}

    public function schema(JsonSchema $schema): array
    {
        return [
            'task_id' => $this->recordIdArgument($schema),
            'view' => $this->caseArgument($schema, ReadView::class),
            'continuation' => $schema->string(),
            'passage' => $schema->string()->max(64),
        ];
    }

    public function readRequest(ToolArguments|null $arguments = null): ReadRequest
    {
        if ($arguments === null) {
            return parent::readRequest();
        }

        return TaskReadResult::requestFor($arguments->ulid('task_id'));
    }

    protected function read(ToolArguments $arguments): ToolResult
    {
        return $this->tasks->read($arguments->ulid('task_id'), $arguments);
    }
}
