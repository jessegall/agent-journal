<?php

declare(strict_types=1);

namespace App\Mcp\Tools;

use App\Contracts\ConversationResolver;
use App\Mcp\Attributes\VisibleToProfiles;
use App\Mcp\Data\ToolResult;
use App\Mcp\Support\ToolArguments;
use App\Values\ReadRequest;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;

#[VisibleToProfiles]
#[Name('messages_show')]
#[Description('Show one message you may see.')]
final class MessageShowTool extends JournalReadTool
{
    public function __construct(private readonly ConversationResolver $conversations) {}

    public function schema(JsonSchema $schema): array
    {
        return [
            'message_id' => $schema->string()->max(26)->required(),
        ];
    }

    public function readRequest(ToolArguments|null $arguments = null): ReadRequest
    {
        return $arguments === null
            ? parent::readRequest()
            : new ReadRequest($this->name(), arguments: ['message_id' => $arguments->text('message_id')]);
    }

    protected function read(ToolArguments $arguments): ToolResult
    {
        return ToolResult::ok(['message' => $this->conversations->detail($arguments->text('message_id'))], []);
    }
}
