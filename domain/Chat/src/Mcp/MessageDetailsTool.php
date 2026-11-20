<?php

declare(strict_types=1);

namespace Domain\Chat\Mcp;

use App\Agents\Values\ReadRequest;
use App\Mcp\Data\ToolResult;
use App\Mcp\Support\ToolArguments;
use App\Mcp\Tools\JournalReadTool;
use Illuminate\Contracts\JsonSchema\JsonSchema;

abstract class MessageDetailsTool extends JournalReadTool
{
    public function __construct(private readonly MessageReadResult $messages) {}

    public function schema(JsonSchema $schema): array
    {
        return [
            'message_id' => $schema->string()->max(26)->required(),
            'continuation' => $schema->string(),
        ];
    }

    final public function readRequest(ToolArguments|null $arguments = null): ReadRequest
    {
        if ($arguments === null) {
            return parent::readRequest();
        }

        return new ReadRequest($this->name(), arguments: ['message_id' => $arguments->ulid('message_id')]);
    }

    final protected function read(ToolArguments $arguments): ToolResult
    {
        return $this->messages->read($arguments->ulid('message_id'), $arguments, $this->name());
    }
}
