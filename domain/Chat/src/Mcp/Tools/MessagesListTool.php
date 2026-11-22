<?php

declare(strict_types=1);

namespace Domain\Chat\Mcp\Tools;

use App\Contracts\Chat\AgentMessageReader;
use App\Enums\AgentInboxState;
use App\Mcp\Contracts\NumberedPages;
use App\Mcp\Data\ToolResult;
use App\Mcp\Support\ListedPage;
use App\Mcp\Support\ToolArguments;
use App\Mcp\Tools\JournalReadTool;
use Domain\Chat\Support\Mcp\MessageReadResult;
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
            fn (ToolArguments $initialArguments) => [
                'state' => $initialArguments->enumOr('state', AgentInboxState::Pending)->value,
                'page' => $initialArguments->positiveIntegerOr('page', 1),
            ],
            fn (ToolArguments $filters) => $this->page(
                $filters->enum('state', AgentInboxState::class),
                $filters->positiveInteger('page'),
            ),
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
