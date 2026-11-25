<?php

declare(strict_types=1);

namespace App\Mcp\Tools;

use App\Attributes\Bus\Dispatches;
use App\Commands\Assignments\ReassignRecord\ReassignRecordCommand;
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
#[Name('assignments_reassign')]
#[Dispatches(ReassignRecordCommand::class)]
#[VisibleToProfiles(DiscoveryProfile::MainAgent)]
#[Description('Move a record to another recipient using the assignment reference you read.')]
final class ReassignRecordTool extends AssignmentWriteTool
{
    protected function writeSchema(JsonSchema $schema): array
    {
        return [
            ...$this->recordSchema($schema),
            'expected_assignment' => $this->expectedSchema($schema),
            'recipient' => $this->assigneeSchema($schema),
        ];
    }

    protected function command(ToolArguments $arguments): ReassignRecordCommand
    {
        return new ReassignRecordCommand(
            $this->record($arguments),
            $this->expected($arguments),
            $this->recipient($arguments),
        );
    }
}
