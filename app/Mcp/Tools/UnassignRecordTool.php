<?php

declare(strict_types=1);

namespace App\Mcp\Tools;

use App\Attributes\Bus\Dispatches;
use App\Commands\Assignments\UnassignRecord\UnassignRecordCommand;
use App\Mcp\Attributes\VisibleToProfiles;
use App\Mcp\Enums\DiscoveryProfile;
use App\Mcp\Support\ToolArguments;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;
use Laravel\Mcp\Server\Tools\Annotations\IsIdempotent;

#[IsIdempotent]
#[IsDestructive]
#[Name('assignments_unassign')]
#[Dispatches(UnassignRecordCommand::class)]
#[VisibleToProfiles(DiscoveryProfile::MainAgent)]
#[Description('Release a record from its current holder using the assignment reference you read.')]
final class UnassignRecordTool extends AssignmentWriteTool
{
    protected function writeSchema(JsonSchema $schema): array
    {
        return [
            ...$this->recordSchema($schema),
            'expected_assignment' => $this->expectedSchema($schema),
        ];
    }

    protected function command(ToolArguments $arguments): UnassignRecordCommand
    {
        return new UnassignRecordCommand($this->record($arguments), $this->expected($arguments));
    }
}
