<?php

declare(strict_types=1);

namespace Domain\Chat\Support\Mcp;

use App\Contracts\Chat\AgentMessageReader;
use App\Mcp\Contracts\OverviewContribution;
use App\Mcp\Data\NextAction;
use App\Mcp\Data\OverviewSection;

/**
 * The unread and pending messages in the caller's inboxes.
 */
final readonly class PendingMessagesOverview implements OverviewContribution
{
    public function __construct(private AgentMessageReader $messages) {}

    public function section(): string
    {
        return 'messages';
    }

    public function read(): OverviewSection
    {
        $counts = $this->messages->counts();

        return OverviewSection::from([
            'title' => 'Messages',
            'counts' => ['unread' => $counts->unread, 'pending' => $counts->pending],
            'nextAction' => new NextAction('messages_list', ['state' => 'pending']),
        ]);
    }
}
