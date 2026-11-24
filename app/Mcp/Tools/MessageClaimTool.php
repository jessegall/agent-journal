<?php

declare(strict_types=1);

namespace App\Mcp\Tools;

use App\Commands\Messages\ClaimSpeech\ClaimSpeechCommand;
use App\Contracts\Bus\Command;
use App\Mcp\Attributes\Dispatches;
use App\Mcp\Attributes\VisibleToProfiles;
use App\Mcp\Enums\DiscoveryProfile;
use App\Mcp\Support\ToolArguments;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;

#[Name(self::NAME)]
#[IsDestructive(false)]
#[Dispatches(ClaimSpeechCommand::class)]
#[VisibleToProfiles(DiscoveryProfile::MainAgent, DiscoveryProfile::WritingHelper, DiscoveryProfile::ReadOnlyHelper)]
#[Description('Claim your turn to speak on one user message of a chat for two minutes. Give the batch_id and '
    .'claim_grant from the chat messages this turn was shown: they prove the claim comes from the turn that read '
    .'them, and a claim from a passive or earlier turn is refused. Give the claim token you get back to your reply, '
    .'answer or post in that chat.')]
final class MessageClaimTool extends MessageWriteTool
{
    public const string NAME = 'messages_claim';

    protected function writeSchema(JsonSchema $schema): array
    {
        return [
            'inbox_id' => $this->recordIdArgument($schema),
            'root_id' => $this->recordIdArgument($schema),
            'batch_id' => $this->recordIdArgument($schema),
            'claim_grant' => $schema->string()->max(64)->required(),
        ];
    }

    protected function command(ToolArguments $arguments): Command
    {
        return new ClaimSpeechCommand(
            $arguments->text('inbox_id'),
            $arguments->text('root_id'),
            $arguments->text('batch_id'),
            $arguments->text('claim_grant'),
        );
    }

    protected function payload(mixed $token): array
    {
        return ['claim_token' => $token];
    }
}
