<?php

declare(strict_types=1);

namespace App\Communication\Mcp;

use App\Bus\Contracts\Command;
use App\Communication\Commands\ClaimSpeech;
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
#[Dispatches(ClaimSpeech::class)]
#[Description('Claim your turn to speak on one user message of a chat for two minutes; give the claim token to your reply, answer or post in that chat.')]
final class MessageClaimTool extends MessageWriteTool
{
    protected function writeSchema(JsonSchema $schema): array
    {
        return [
            'inbox_id' => $schema->string()->max(26)->required(),
            'root_id' => $schema->string()->max(26)->required(),
        ];
    }

    protected function command(ToolArguments $arguments): Command
    {
        return new ClaimSpeech($arguments->text('inbox_id'), $arguments->text('root_id'));
    }

    protected function payload(mixed $token): array
    {
        return ['claim_token' => $token];
    }
}
