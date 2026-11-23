<?php

declare(strict_types=1);

namespace App\Resolvers\Support;

use App\Contracts\Actors\CurrentActor;
use App\Contracts\Chat\ChatTimeline;
use App\Contracts\Chat\ConversationResolver;
use App\Contracts\Chat\InboxResolver;
use App\Data\ChatCursorPosition;
use App\Data\ChatEventPage;
use App\Data\ChatEventView;
use App\Data\MessagePage;
use App\Enums\TimelineEventType;
use App\Exceptions\ChatCursorRefused;
use App\Models\Chats\InboxInterval;
use App\Models\Chats\InboxRecord;
use App\Models\Chats\TimelineEvent;
use App\Models\Messages\Message;
use App\Support\ActorIdentity;
use App\Support\ChatInboxes;
use App\Support\ChatInterval;
use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Contracts\Encryption\Encrypter;
use Spatie\LaravelData\Exceptions\CannotCreateData;
use TypeError;

/**
 * A chat member's own view of its chat's timeline: a snapshot to start from, then the events after an opaque cursor
 * up to a watermark, fifty at most, skipping what its membership may not see. The cursor names the inbox, the
 * membership interval and the last position read, so it is refused for another chat or after a rejoin; a member whose
 * access ended is told only that.
 */
final readonly class IntervalChatTimeline implements ChatTimeline
{
    public const int PAGE_LIMIT = 50;

    private const int SCAN_LIMIT = 100;

    public function __construct(
        private CurrentActor $actors,
        private InboxResolver $inboxes,
        private ChatInboxes $chats,
        private ConversationResolver $conversations,
        private Encrypter $encrypter,
    ) {}

    /**
     * Who is in the chat, the reader's unread count, its newest page and the cursor that continues from the watermark.
     */
    public function snapshot(string $inboxId): ChatEventPage
    {
        $interval = $this->currentInterval($inboxId);

        if ($interval === null) {
            return ChatEventPage::accessEnded($inboxId);
        }

        $watermark = $this->watermarkOf($inboxId);

        return new ChatEventPage(
            $inboxId,
            false,
            [],
            $this->cursorAt($interval, $watermark),
            $watermark,
            $this->chats->activeIntervals($this->inboxes->resolve($inboxId)),
            $this->conversations->counts($inboxId)->unread,
            $this->conversations->timeline($inboxId, null, MessagePage::DEFAULT_LIMIT),
        );
    }

    /**
     * The events after the cursor that the reader's interval may see, up to the watermark.
     *
     * @throws ChatCursorRefused
     */
    public function after(string $inboxId, string $cursor): ChatEventPage
    {
        $interval = $this->currentInterval($inboxId);

        if ($interval === null) {
            return ChatEventPage::accessEnded($inboxId);
        }

        $from = $this->positionIn($cursor, $interval);
        $watermark = $this->watermarkOf($inboxId);

        $events = TimelineEvent::query()
            ->ofInbox($inboxId)
            ->where('sequence', '>', $from)
            ->where('sequence', '<=', $watermark)
            ->orderBy('sequence')
            ->limit(self::SCAN_LIMIT)
            ->get();

        $received = $this->receivedMessagesOf(
            $interval,
            array_values($events->map(fn (TimelineEvent $event) => $event->id)->all()),
        );

        $shown = [];
        $last = $from;

        foreach ($events as $event) {
            if (count($shown) === self::PAGE_LIMIT) {
                break;
            }

            $last = $event->sequence;
            $messageId = $received[$event->id] ?? null;

            if ($event->type === TimelineEventType::Message && $messageId === null) {
                continue;
            }

            $shown[] = new ChatEventView(
                $event->sequence,
                $event->type,
                $event->actor,
                $messageId,
                $messageId,
            );
        }

        $next = $this->cursorAt($interval, $last);

        return new ChatEventPage($inboxId, false, $shown, $next, $watermark, [], null, null);
    }

    /**
     * The reader's active interval in the chat, or none once its access ended.
     */
    private function currentInterval(string $inboxId): ChatInterval|null
    {
        $reader = ActorIdentity::of($this->actors->actor());
        $interval = InboxInterval::query()->activeFor($inboxId)->heldBy($reader)->first();

        return $interval === null ? null : $interval->chatInterval;
    }

    private function watermarkOf(string $inboxId): int
    {
        return (int) InboxRecord::query()->whereKey($inboxId)->value('next_sequence');
    }

    private function cursorAt(ChatInterval $interval, int $sequence): string
    {
        return $this->encrypter->encrypt(ChatCursorPosition::from([
            'inbox' => $interval->inboxId,
            'interval' => $interval->intervalId,
            'sequence' => $sequence,
        ])->toArray());
    }

    /**
     * The position a cursor stands at, when it was issued for this very interval.
     *
     * @throws ChatCursorRefused
     */
    private function positionIn(string $cursor, ChatInterval $interval): int
    {
        try {
            $position = ChatCursorPosition::from($this->encrypter->decrypt($cursor));
        } catch (DecryptException|CannotCreateData|TypeError $unreadable) {
            throw ChatCursorRefused::forInbox($interval->inboxId, $unreadable);
        }

        if (! $position->isFor($interval)) {
            throw ChatCursorRefused::forInbox($interval->inboxId);
        }

        return max($position->sequence, $interval->joinedSequence - 1);
    }

    /**
     * The messages among these timeline events that the interval received, keyed by their event id.
     *
     * @param  list<string>  $eventIds
     * @return array<string, string>
     */
    private function receivedMessagesOf(ChatInterval $interval, array $eventIds): array
    {
        $rows = Message::query()
            ->acrossInboxes()
            ->whereIn('timeline_event_id', $eventIds)
            ->whereIn('id', fn ($receipts) => $receipts
                ->select('message_id')
                ->from('message_receipts')
                ->where('interval_id', $interval->intervalId))
            ->pluck('id', 'timeline_event_id')
            ->all();

        return array_map(strval(...), $rows);
    }
}
