<?php

declare(strict_types=1);

namespace App\Communication\Mcp;

use App\Communication\Contracts\ConversationResolver;
use App\Communication\Data\MessagePage;
use App\Mcp\Data\ToolResult;
use App\Mcp\Support\ToolArguments;
use App\Mcp\Tools\JournalReadTool;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;

#[Name('inbox_history')]
#[Description('Page back through the history of an inbox you sit at, oldest first within a page, with a cursor to older ones.')]
final class InboxHistoryTool extends JournalReadTool
{
    public function __construct(private readonly ConversationResolver $conversations) {}

    public function schema(JsonSchema $schema): array
    {
        return [
            'inbox_id' => $schema->string()->max(26)->required(),
            'older_cursor' => $schema->string()->max(26),
            'limit' => $schema->integer()->min(1)->max(100),
        ];
    }

    protected function read(ToolArguments $arguments): ToolResult
    {
        return ToolResult::ok(['page' => $this->conversations->history(
            $arguments->text('inbox_id'),
            $arguments->optionalText('older_cursor'),
            $arguments->positiveIntegerOr('limit', MessagePage::DEFAULT_LIMIT, MessagePage::LARGEST_LIMIT),
        )], []);
    }
}
