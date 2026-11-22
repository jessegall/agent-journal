<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\ChatLines;
use App\Enums\LineCardPlacement;
use App\Enums\TimelineEventType;
use App\Models\InboxInterval;
use App\Models\InboxRecord;
use App\Models\TimelineEvent;
use App\Support\Cards\DockIdentity;
use App\Values\ChatLine;
use App\Values\PostedLine;

/**
 * Posts a plain line about an agent into the timeline of every chat the agent is a member of now, each at the next
 * position under that chat's lock, so it shows between the messages in the order it happened. A domain calls it from a
 * listener that runs inside its command, so the line commits with what it tells.
 */
final readonly class TimelineChatLines implements ChatLines
{
    /**
     * The most lines one page of a chat reads, as many as the messages a page holds.
     */
    private const int PAGE_LINE_LIMIT = 50;

    /**
     * The most chats one line goes into: an agent is a member of a few chats, never of many.
     */
    private const int CHAT_LIMIT = 20;

    public function post(
        ActorIdentity $agent,
        string $subject,
        string $line,
        DockIdentity|null $source = null,
        LineCardPlacement $placement = LineCardPlacement::Inline,
    ): void {
        $inboxIds = InboxInterval::query()->stillOpen()->heldBy($agent)->select('inbox_id');

        foreach (InboxRecord::lockedForSequences($inboxIds, self::CHAT_LIMIT) as $inbox) {
            TimelineEvent::create(
                $inbox->id,
                $inbox->takeSequence(),
                TimelineEventType::Line,
                $agent,
                null,
                new PostedLine($subject, $line, $source, $placement),
            );
        }
    }

    /**
     * The chat's lines from the given position on, oldest first.
     *
     * @return list<ChatLine>
     */
    public function linesFrom(string $inboxId, int $sequence): array
    {
        $events = TimelineEvent::query()
            ->ofInbox($inboxId)
            ->where('type', TimelineEventType::Line)
            ->where('sequence', '>=', $sequence)
            ->orderBy('sequence')
            ->limit(self::PAGE_LINE_LIMIT)
            ->get();

        return array_values($events->map(fn (TimelineEvent $event) => $event->chatLine())->all());
    }
}
