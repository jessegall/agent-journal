<?php

declare(strict_types=1);

namespace App\Mcp\Tools;

use App\Commands\CommandRules\StartSample\StartSampleCommand;
use App\Attributes\Bus\Dispatches;
use App\Mcp\Attributes\VisibleToProfiles;
use App\Mcp\Data\ToolResult;
use App\Mcp\Enums\DiscoveryProfile;
use App\Mcp\Support\ToolArguments;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;

/**
 * Runs the one evidence sample a held command request waits on, under the permit the owner's approval gave.
 */
#[Name(self::NAME)]
#[IsDestructive(false)]
#[Dispatches(StartSampleCommand::class)]
#[VisibleToProfiles(DiscoveryProfile::MainAgent, DiscoveryProfile::WritingHelper)]
#[Description('Run the evidence sample a held command request waits on, under the permit its approval gave.')]
final class CommandRequestSampleTool extends JournalWriteTool
{
    public const string NAME = 'command_requests_sample';

    protected function writeSchema(JsonSchema $schema): array
    {
        return [
            'request' => $this->recordIdArgument($schema),
            'permit' => $schema->string()->max(64)->required(),
        ];
    }

    protected function command(ToolArguments $arguments): StartSampleCommand
    {
        return new StartSampleCommand(
            $arguments->ulid('request'),
            $arguments->text('permit'),
            $arguments->text('request_key'),
        );
    }

    protected function present(mixed $reply): ToolResult
    {
        return ToolResult::ok(['run_id' => $reply]);
    }
}
