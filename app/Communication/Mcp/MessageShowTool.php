<?php

declare(strict_types=1);

namespace App\Communication\Mcp;

use App\Communication\Contracts\ConversationResolver;
use App\Mcp\Data\ToolResult;
use App\Mcp\Support\ToolArguments;
use App\Mcp\Tools\JournalReadTool;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;

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

    protected function read(ToolArguments $arguments): ToolResult
    {
        return ToolResult::ok(['message' => $this->conversations->detail($arguments->text('message_id'))], []);
    }
}
