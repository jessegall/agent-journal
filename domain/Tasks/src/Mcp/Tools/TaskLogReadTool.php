<?php

declare(strict_types=1);

namespace Domain\Tasks\Mcp\Tools;

use App\Mcp\Data\ToolResult;
use App\Mcp\Support\ToolArguments;
use App\Mcp\Tools\JournalReadTool;
use App\Values\ReadRequest;
use Domain\Tasks\Support\Mcp\TaskLogReadResult;
use Domain\Tasks\Support\Mcp\TaskReadResult;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsReadOnly;

#[IsReadOnly]
#[Name(TaskLogReadResult::TOOL)]
#[Description('Read one log line of a task, as search found it, with the lines around it.')]
final class TaskLogReadTool extends JournalReadTool
{
    public function __construct(private readonly TaskLogReadResult $lines) {}

    public function schema(JsonSchema $schema): array
    {
        return [
            TaskReadResult::ID_ARGUMENT => $this->recordIdArgument($schema),
            TaskLogReadResult::ENTRY_ARGUMENT => $this->recordIdArgument($schema),
        ];
    }

    /**
     * A line is read under the read of its task: the same targeted tasks_read search asked before it showed it.
     */
    public function readRequest(ToolArguments|null $arguments = null): ReadRequest
    {
        if ($arguments === null) {
            return ReadRequest::forDiscovery(TaskReadResult::TOOL);
        }

        return TaskReadResult::requestFor($arguments->ulid(TaskReadResult::ID_ARGUMENT));
    }

    protected function read(ToolArguments $arguments): ToolResult
    {
        return $this->lines->read(
            $arguments->ulid(TaskReadResult::ID_ARGUMENT),
            $arguments->ulid(TaskLogReadResult::ENTRY_ARGUMENT),
        );
    }
}
