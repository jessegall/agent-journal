<?php

declare(strict_types=1);

namespace App\Communication\Mcp;

use App\Bus\Contracts\Command;
use App\Communication\Commands\DismissMessage;
use App\Mcp\Attributes\Dispatches;
use App\Mcp\Attributes\VisibleToProfiles;
use App\Mcp\Enums\DiscoveryProfile;
use App\Mcp\Support\ToolArguments;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;
use Laravel\Mcp\Server\Tools\Annotations\IsIdempotent;

#[IsIdempotent]
#[IsDestructive(true)]
#[Name('messages_dismiss')]
#[Dispatches(DismissMessage::class)]
#[VisibleToProfiles(DiscoveryProfile::MainAgent, DiscoveryProfile::WritingHelper, DiscoveryProfile::ReadOnlyHelper)]
#[Description('Withdraw a message you wrote, or decline one sent to your inbox, with a reason.')]
final class MessageDismissTool extends MessageWriteTool
{
    protected function writeSchema(JsonSchema $schema): array
    {
        return [
            'message_id' => $schema->string()->max(26)->required(),
            'reason' => $schema->string()->max(2000)->required(),
        ];
    }

    protected function command(ToolArguments $arguments): Command
    {
        return new DismissMessage(
            $arguments->text('message_id'),
            $arguments->text('reason'),
        );
    }

    protected function payload(mixed $result): array
    {
        return ['dismissed' => true];
    }
}
