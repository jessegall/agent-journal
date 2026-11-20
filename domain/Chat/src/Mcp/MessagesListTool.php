<?php

declare(strict_types=1);

namespace Domain\Chat\Mcp;

use App\Communication\Contracts\AgentMessageReader;
use App\Communication\Enums\AgentInboxState;
use App\Mcp\Contracts\NumberedPages;
use App\Mcp\Data\ToolResult;
use App\Mcp\Support\ListedPage;
use App\Mcp\Support\ToolArguments;
use App\Mcp\Tools\JournalReadTool;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsReadOnly;

#[IsReadOnly]
#[Name('messages_list')]
#[Description('List messages in your inboxes, 20 at a time, filtering by pending, answered, or all.')]
final class MessagesListTool extends JournalReadTool
{
    public function __construct(private readonly AgentMessageReader $messages, private readonly NumberedPages $pages) {}

    public function schema(JsonSchema $schema): array
    {
        return [
            'state' => $schema->string()->enum(array_column(AgentInboxState::cases(), 'value')),
            'page' => $schema->integer()->min(1),
            'continuation' => $schema->string(),
        ];
    }

    protected function read(ToolArguments $arguments): ToolResult
    {
        return $this->pages->answer(
            $this->name(),
            $arguments,
            fn (ToolArguments $first) => [
                'state' => $first->enumOr('state', AgentInboxState::Pending)->value,
                'page' => $first->positiveIntegerOr('page', 1),
            ],
            fn (array $filters) => $this->page(AgentInboxState::from($filters['state']), $filters['page']),
        );
    }

    private function page(AgentInboxState $state, int $page): ListedPage
    {
        $inbox = $this->messages->inbox($state, $page);
        $cards = [];

        foreach ($inbox->messages as $message) {
            $cards[$message->id] = MessageReadResult::card($message);
        }

        return new ListedPage($cards, $inbox->page->number, $inbox->page->size, $inbox->total);
    }
}
