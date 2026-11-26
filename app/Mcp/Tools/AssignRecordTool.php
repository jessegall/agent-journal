<?php

declare(strict_types=1);

namespace App\Mcp\Tools;

use App\Assignments\Commands\AssignRecord\AssignRecordCommand;
use App\Bus\Attributes\Dispatches;
use App\Mcp\Support\ToolArguments;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;
use Laravel\Mcp\Server\Tools\Annotations\IsIdempotent;

#[IsIdempotent]
#[IsDestructive(false)]
#[Name('assignments_assign')]
#[Dispatches(AssignRecordCommand::class)]
#[Description('Give an unheld record to an eligible recipient, or confirm that they already hold it.')]
final class AssignRecordTool extends AssignmentWriteTool
{
    protected function writeSchema(JsonSchema $schema): array
    {
        return [
            ...$this->recordSchema($schema),
            'recipient' => $this->assigneeSchema($schema),
        ];
    }

    protected function command(ToolArguments $arguments): AssignRecordCommand
    {
        return new AssignRecordCommand($this->record($arguments), $this->recipient($arguments));
    }
}
