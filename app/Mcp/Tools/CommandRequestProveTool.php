<?php

declare(strict_types=1);

namespace App\Mcp\Tools;

use App\Attributes\Bus\Dispatches;
use App\Commands\CommandRules\ProveReader\ProveReaderCommand;
use App\Mcp\Attributes\VisibleToProfiles;
use App\Mcp\Data\ToolResult;
use App\Mcp\Enums\DiscoveryProfile;
use App\Mcp\Support\ToolArguments;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;

/**
 * Proves a held command request's reader against its sample runs, so the owner can approve the declaration.
 */
#[Name(self::NAME)]
#[IsDestructive(false)]
#[Dispatches(ProveReaderCommand::class)]
#[VisibleToProfiles(DiscoveryProfile::MainAgent, DiscoveryProfile::WritingHelper)]
#[Description("Prove a held command request's reader revision against its sample runs, for the owner's approval.")]
final class CommandRequestProveTool extends JournalWriteTool
{
    public const string NAME = 'command_requests_prove';

    private const int RUN_LIMIT = 20;

    protected function writeSchema(JsonSchema $schema): array
    {
        return [
            'request' => $this->recordIdArgument($schema),
            'reader_revision' => $schema->string()->max(64)->required(),
            'runs' => $schema->array()
                ->items($this->optionalRecordIdArgument($schema))
                ->min(1)
                ->max(self::RUN_LIMIT)
                ->required(),
        ];
    }

    protected function command(ToolArguments $arguments): ProveReaderCommand
    {
        return new ProveReaderCommand(
            $arguments->ulid('request'),
            $arguments->text('reader_revision'),
            $arguments->ulids('runs'),
        );
    }

    protected function present(mixed $reply): ToolResult
    {
        return ToolResult::ok(['proof_id' => $reply, 'state' => 'awaiting_approval']);
    }
}
