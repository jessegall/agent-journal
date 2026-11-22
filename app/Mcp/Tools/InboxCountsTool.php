<?php

declare(strict_types=1);

namespace App\Mcp\Tools;

use App\Contracts\Chat\ConversationResolver;
use App\Mcp\Attributes\VisibleToProfiles;
use App\Mcp\Data\ToolResult;
use App\Mcp\Support\ToolArguments;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;

#[VisibleToProfiles]
#[Name('inbox_counts')]
#[Description('Count what is unread in an inbox and how many questions wait, taken up or not.')]
final class InboxCountsTool extends JournalReadTool
{
    public function __construct(private readonly ConversationResolver $conversations) {}

    public function schema(JsonSchema $schema): array
    {
        return [
            'inbox_id' => $schema->string()->max(26)->required(),
        ];
    }

    protected function read(ToolArguments $arguments): ToolResult
    {
        return ToolResult::ok(['counts' => $this->conversations->counts($arguments->text('inbox_id'))], []);
    }
}
