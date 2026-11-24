<?php

declare(strict_types=1);

namespace App\Mcp\Tools;

use App\Commands\CommandRules\ProposeRuleDeclaration\ProposeRuleDeclarationCommand;
use App\Mcp\Attributes\Dispatches;
use App\Mcp\Attributes\VisibleToProfiles;
use App\Mcp\Data\ToolResult;
use App\Mcp\Enums\DiscoveryProfile;
use App\Mcp\Support\ToolArguments;
use App\Values\ProposalReceipt;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;

/**
 * Proposes the command type a held command request waits on: its declaration of evidence, examples and rule.
 */
#[Name(self::NAME)]
#[IsDestructive(false)]
#[Dispatches(ProposeRuleDeclarationCommand::class)]
#[VisibleToProfiles(DiscoveryProfile::MainAgent, DiscoveryProfile::WritingHelper)]
#[Description(
    'Propose the command type a held command request waits on, for the owner to approve: a declaration file as '
    .'JSON text, {"declarations": [one declaration with its request_id, evidence, examples and rule]}.',
)]
final class CommandTypeProposeTool extends JournalWriteTool
{
    public const string NAME = 'command_types_propose';

    protected function writeSchema(JsonSchema $schema): array
    {
        return [
            'request' => $this->recordIdArgument($schema),
            'declaration_file' => $schema->string()->required(),
        ];
    }

    protected function command(ToolArguments $arguments): ProposeRuleDeclarationCommand
    {
        return new ProposeRuleDeclarationCommand(
            $arguments->ulid('request'),
            $arguments->text('declaration_file'),
        );
    }

    /**
     * @param  ProposalReceipt  $reply
     */
    protected function present(mixed $reply): ToolResult
    {
        return ToolResult::ok($reply->toArray());
    }
}
