<?php

declare(strict_types=1);

namespace Domain\Memory\Mcp\Tools;

use App\Mcp\Attributes\VisibleToProfiles;
use App\Mcp\Data\ToolResult;
use App\Mcp\Enums\DiscoveryProfile;
use App\Mcp\Support\ToolArguments;
use App\Mcp\Tools\JournalReadTool;
use App\Values\ReadRequest;
use Domain\Memory\Support\Mcp\MemoryReadResult;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsReadOnly;

#[IsReadOnly]
#[Name(MemoryReadResult::TOOL)]
#[Description('Read the text, weight, and revision of one of your memories.')]
#[VisibleToProfiles(DiscoveryProfile::MainAgent, DiscoveryProfile::WritingHelper)]
final class MemoryReadTool extends JournalReadTool
{
    public function __construct(private readonly MemoryReadResult $memories) {}

    public function schema(JsonSchema $schema): array
    {
        return [
            'memory_id' => $schema->string()->max(26)->required(),
            'continuation' => $schema->string(),
        ];
    }

    public function readRequest(ToolArguments|null $arguments = null): ReadRequest
    {
        if ($arguments === null) {
            return ReadRequest::forDiscovery($this->name());
        }

        return new ReadRequest(
            $this->name(),
            arguments: ['memory_id' => $arguments->ulid('memory_id')],
        );
    }

    protected function read(ToolArguments $arguments): ToolResult
    {
        return $this->memories->read($arguments->ulid('memory_id'), $arguments->continuation());
    }
}
