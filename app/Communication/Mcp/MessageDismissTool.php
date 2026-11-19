<?php

declare(strict_types=1);

namespace App\Communication\Mcp;

use App\Bus\Contracts\Command;
use App\Bus\Support\RequestKey;
use App\Communication\Commands\DismissMessage;
use App\Mcp\Support\ToolArguments;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;

#[Name('messages_dismiss')]
#[Description('Withdraw a message you wrote, or decline one sent to your inbox, with a reason.')]
final class MessageDismissTool extends MessageWriteTool
{
    public function schema(JsonSchema $schema): array
    {
        return [
            'message_id' => $schema->string()->max(26)->required(),
            'reason' => $schema->string()->max(2000)->required(),
            'request_key' => $schema->string()->max(RequestKey::LONGEST)->required(),
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
