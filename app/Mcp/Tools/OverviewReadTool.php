<?php

declare(strict_types=1);

namespace App\Mcp\Tools;

use App\Mcp\Data\ToolResult;
use App\Mcp\Support\OverviewReader;
use App\Mcp\Support\ToolArguments;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsReadOnly;

/**
 * overview_read: the caller's session, the state its stack answers from and each owner's counts of its work.
 */
#[Name('overview_read')]
#[Description('Your agent, session and role, the state your stack answers from, and counts of the work you hold with the call that lists it. Read this first.')]
#[IsReadOnly]
final class OverviewReadTool extends JournalReadTool
{
    protected ?array $meta = ['anthropic/alwaysLoad' => true];

    public function __construct(private readonly OverviewReader $overview) {}

    public function outputSchema(JsonSchema $schema): array
    {
        return [
            'status' => $schema->string()->required(),
            'agent_id' => $schema->string()->required(),
            'session_id' => $schema->string()->required(),
            'role' => $schema->string()->required(),
            'stack_state' => $schema->string()->nullable()->required(),
            'sections' => $schema->object()->required(),
            'next_actions' => $schema->array()->required(),
        ];
    }

    protected function read(ToolArguments $arguments): ToolResult
    {
        return $this->overview->read();
    }
}
