<?php

declare(strict_types=1);

namespace App\Communication\Resolvers;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Support\ActorIdentity;
use App\Actors\Support\AttentionOrigin;
use App\Assignments\Support\ProvedClaims;
use App\Communication\Contracts\ConversationResolver;
use App\Communication\Data\InboxCounts;
use App\Communication\Data\MessagePage;
use App\Communication\Data\MessageView;
use App\Communication\Enums\MessageState;
use App\Communication\Exceptions\MessageMissing;
use App\Communication\Models\Message;
use App\Communication\Models\MessageAttention;
use App\Communication\Support\InboxMembers;
use Illuminate\Database\Eloquent\Builder;

/**
 * Reads messages through the visibility scope: what the actor may see now, page by page on creation time and id, so
 * a cursor kept from before the actor lost a seat finds nothing it may no longer see.
 */
final readonly class MessageRecords implements ConversationResolver
{
    public function __construct(
        private ProvedClaims $proved,
        private CurrentActor $actors,
    ) {}

    public function detail(string $messageId): MessageView
    {
        $message = Message::query()->find($messageId) ?? throw MessageMissing::forId($messageId);

        return $this->viewOf($message);
    }

    public function between(
        string $firstInboxId,
        string $secondInboxId,
        string|null $olderCursor,
        int $limit,
    ): MessagePage {
        return $this->page(Message::query()->betweenInboxes($firstInboxId, $secondInboxId), $olderCursor, $limit);
    }

    public function history(string $inboxId, string|null $olderCursor, int $limit): MessagePage
    {
        return $this->page(Message::query()->ofInbox($inboxId), $olderCursor, $limit);
    }

    public function counts(string $inboxId): InboxCounts
    {
        $incoming = fn () => Message::query()->toInbox($inboxId);
        $waitingIds = $incoming()
            ->where('state', MessageState::WaitingForAnswer)
            ->readLimit(MessagePage::LARGEST_LIMIT * 10)
            ->pluck('id')
            ->all();
        $claimed = count($this->proved->validClaimsOn(Message::LINK_TYPE, array_values($waitingIds)));

        return new InboxCounts(
            $incoming()->whereNull('read_at')->distinct()->count('id'),
            count($waitingIds) - $claimed,
            $claimed,
        );
    }

    public function wakeStatus(string $messageId): array
    {
        $message = Message::query()->find($messageId);

        if ($message === null || ! $message->isWrittenBy(ActorIdentity::of($this->actors->actor()))) {
            throw MessageMissing::forId($messageId);
        }

        return array_values(MessageAttention::query()
            ->where('origin_type', AttentionOrigin::MESSAGE)
            ->where('origin_id', $message->id)
            ->readLimit(InboxMembers::LIMIT)
            ->get()
            ->map(fn (MessageAttention $attention) => $attention->wakeStatus())
            ->all());
    }

    /**
     * @param  Builder<Message>  $query
     */
    private function page(Builder $query, string|null $olderCursor, int $limit): MessagePage
    {
        $pageSize = max(1, min($limit, MessagePage::LARGEST_LIMIT));
        $cursor = $olderCursor === null ? null : Message::query()->find($olderCursor);
        $rows = $query
            ->when($cursor !== null, fn (Builder $older) => $older->olderThan($cursor))
            ->orderByDesc('created_at')
            ->orderByDesc('id')
            ->limit($pageSize + 1)
            ->get();
        $shown = $rows->take($pageSize);

        return new MessagePage(
            array_values($shown->reverse()->map($this->viewOf(...))->all()),
            $rows->count() > $pageSize ? $shown->last()?->id : null,
        );
    }

    private function viewOf(Message $message): MessageView
    {
        return new MessageView(
            $message->id,
            $message->source_inbox_id,
            $message->destination_inbox_id,
            $message->sender_type,
            $message->sender_id,
            $message->body,
            $message->state,
            $message->state_version,
            $message->reply_to_id,
            $message->read_at?->toIso8601String(),
            (string) $message->created_at?->toIso8601String(),
        );
    }
}
