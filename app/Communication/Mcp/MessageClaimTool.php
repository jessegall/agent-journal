<?php

declare(strict_types=1);

namespace App\Communication\Mcp;

use App\Bus\Contracts\Command;
use App\Communication\Commands\ClaimSpeech\ClaimSpeechCommand;
use App\Mcp\Attributes\Dispatches;
use App\Mcp\Attributes\VisibleToProfiles;
use App\Mcp\Support\ToolArguments;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;

#[VisibleToProfiles]
#[IsDestructive(false)]
#[Name('messages_claim')]
#[Dispatches(ClaimSpeechCommand::class)]
#[Description('Claim your turn to speak on one user message of a chat for two minutes. Give the batch_id and '
    .'claim_grant from the chat messages this turn was shown: they prove the claim comes from the turn that read '
    .'them, and a claim from a passive or earlier turn is refused. Give the claim token you get back to your reply, '
    .'answer or post in that chat.')]
final class MessageClaimTool extends MessageWriteTool
{
    protected function writeSchema(JsonSchema $schema): array
    {
        return [
            'inbox_id' => $schema->string()->max(26)->required(),
            'root_id' => $schema->string()->max(26)->required(),
            'batch_id' => $schema->string()->max(26)->required(),
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
