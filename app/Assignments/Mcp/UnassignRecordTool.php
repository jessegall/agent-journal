<?php

declare(strict_types=1);

namespace App\Assignments\Mcp;

use App\Assignments\Commands\UnassignRecord;
use App\Mcp\Attributes\Dispatches;
use App\Mcp\Support\ToolArguments;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;
use Laravel\Mcp\Server\Tools\Annotations\IsIdempotent;

#[IsIdempotent]
#[IsDestructive]
#[Name('assignments_unassign')]
#[Dispatches(UnassignRecord::class)]
#[Description('Release a record from its current holder using the assignment reference you read.')]
final class UnassignRecordTool extends AssignmentWriteTool
{
    protected function writeSchema(JsonSchema $schema): array
    {
        return [...$this->recordSchema($schema), 'expected_assignment' => $this->expectedSchema($schema)];
    }

    protected function command(ToolArguments $arguments): UnassignRecord
    {
        return new UnassignRecord($this->record($arguments), $this->expected($arguments));
    }
}
