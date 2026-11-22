<?php

declare(strict_types=1);

namespace Domain\Helpers\Mcp\Tools;

use App\Mcp\Attributes\Dispatches;
use App\Mcp\Attributes\VisibleToProfiles;
use App\Mcp\Data\ToolResult;
use App\Mcp\Enums\DiscoveryProfile;
use App\Mcp\Support\ToolArguments;
use App\Mcp\Tools\JournalWriteTool;
use Domain\Helpers\Commands\SteerHelper\SteerHelperCommand;
use Domain\Helpers\Data\HelperSteerData;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;

#[IsDestructive(false)]
#[Name('helpers_steer')]
#[Dispatches(SteerHelperCommand::class)]
#[VisibleToProfiles(DiscoveryProfile::MainAgent)]
#[Description('Add to the current job of a helper; kept for its next job when none is live.')]
final class SteerHelperTool extends JournalWriteTool
{
    protected function writeSchema(JsonSchema $schema): array
    {
        return [
            'identity_id' => $schema->string()->max(64)->required(),
            'text' => $schema->string()->max(4000)->required(),
        ];
    }

    protected function command(ToolArguments $arguments): SteerHelperCommand
    {
        return new SteerHelperCommand($arguments->ulid('identity_id'), $arguments->text('text'));
    }

    protected function present(mixed $commandResult): ToolResult
    {
        return ToolResult::ok(HelperSteerData::from($commandResult)->toArray());
    }
}
