<?php

declare(strict_types=1);

namespace Domain\Chat\Mcp;

use App\Communication\Commands\DismissMessage;
use App\Mcp\Attributes\Dispatches;
use App\Mcp\Attributes\VisibleToProfiles;
use App\Mcp\Data\ToolResult;
use App\Mcp\Enums\DiscoveryProfile;
use App\Mcp\Support\ToolArguments;
use App\Mcp\Tools\JournalWriteTool;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;
use Laravel\Mcp\Server\Tools\Annotations\IsIdempotent;

#[IsIdempotent]
#[IsDestructive(true)]
#[Name('messages_dismiss')]
#[Dispatches(DismissMessage::class)]
#[VisibleToProfiles(DiscoveryProfile::MainAgent)]
#[Description('Withdraw a message you wrote, or decline one sent to your inbox, with a reason.')]
final class DismissMessageTool extends JournalWriteTool
{
    protected function writeSchema(JsonSchema $schema): array
    {
        return [
            'message_id' => $schema->string()->max(26)->required(),
            'reason' => $schema->string()->max(2000)->required(),
        ];
    }

    protected function command(ToolArguments $arguments): DismissMessage
    {
        return new DismissMessage(
            $arguments->ulid('message_id'),
            $arguments->text('reason'),
        );
    }

    protected function present(mixed $commandResult): ToolResult
    {
        return ToolResult::ok(['dismissed' => true]);
    }
}
