<?php

declare(strict_types=1);

namespace Domain\Chat\Mcp;

use App\Mcp\Attributes\VisibleToProfiles;
use App\Mcp\Data\ToolResult;
use App\Mcp\Enums\DiscoveryProfile;
use App\Mcp\Support\ToolArguments;
use App\Mcp\Tools\JournalReadTool;
use Domain\Chat\Resolvers\Support\DockListing;
use Domain\Chat\Support\DockProjection;
use Domain\Chat\Support\DockRequests;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsReadOnly;

/**
 * dock_list: the placements of the caller's conversation with only their safe facts, as journal dock list prints them.
 */
#[IsReadOnly]
#[Name('dock_list')]
#[VisibleToProfiles(DiscoveryProfile::MainAgent, DiscoveryProfile::WritingHelper)]
#[Description('The records docked above your conversation: placement id, type, source id, title and state, never a card body. Give chat when you take part in several conversations.')]
final class DockListTool extends JournalReadTool
{
    public function __construct(private readonly DockRequests $requests, private readonly DockListing $listing) {}

    public function schema(JsonSchema $schema): array
    {
        return [
            'chat' => $schema->string()->max(26),
            'limit' => $schema->integer()->min(1)->max(DockProjection::LARGEST_CARD_LIMIT),
        ];
    }

    protected function read(ToolArguments $arguments): ToolResult
    {
        $conversation = $this->requests->chosenConversation($arguments->optionalText('chat'));

        $largest = DockProjection::LARGEST_CARD_LIMIT;
        $limit = $arguments->positiveIntegerOr('limit', $largest, $largest);
        $listed = $this->listing->of($conversation, $limit);

        return ToolResult::ok($listed->toArray());
    }
}
