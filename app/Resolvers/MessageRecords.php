<?php

declare(strict_types=1);

namespace App\Resolvers;

use App\Contracts\Actors\ActorLabels;
use App\Contracts\Actors\CurrentActor;
use App\Contracts\Authorization\CurrentAuthorizer;
use App\Contracts\Chat\ConversationResolver;
use App\Contracts\Chat\InboxResolver;
use App\Data\Messages\InboxCounts;
use App\Data\Messages\InboxView;
use App\Data\Messages\MessageClaimHolder;
use App\Data\Messages\MessagePage;
use App\Data\Messages\MessageView;
use App\Data\Messages\ReplyOriginal;
use App\Enums\AccessType;
use App\Enums\MessageType;
use App\Exceptions\ChatInboxRefused;
use App\Exceptions\MessageMissing;
use App\Models\Chats\InboxRecord;
use App\Models\Chats\TimelineEvent;
use App\Models\CommandRules\CommandReceipt;
use App\Models\Messages\Message;
use App\Models\Messages\MessageAttention;
use App\Models\Messages\ReceiptDelivery;
use App\Policies\MessageAdministrationPolicy;
use App\Support\ActorIdentity;
use App\Support\AttentionOrigin;
use App\Support\InboxMembers;
use App\Support\ProvedClaims;
use App\Support\RegisteredInboxes;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Str;

/**
 * Reads messages through the visibility scope: what the actor may see now, page by page on creation time and id, so
 * a cursor kept from before the actor lost a seat finds nothing it may no longer see.
 */
final readonly class MessageRecords implements ConversationResolver
{
    public function __construct(
        private ProvedClaims $proved,
        private CurrentActor $actors,
        private InboxResolver $inboxes,
        private ActorLabels $labels,
        private RegisteredInboxes $members,
        private CurrentAuthorizer $authorizer,
    ) {}

    public function detail(string $messageId): MessageView
    {
        $message = Message::query()->findOr($messageId, fn () => throw MessageMissing::forId($messageId));

        return $this->viewsOf([$message])[0];
    }

    public function canSee(string $messageId): bool
    {
        return Message::query()->whereKey($messageId)->exists();
    }

    public function between(
        string $firstInboxId,
        string $secondInboxId,
        string|null $olderCursor,
        int $limit,
    ): MessagePage {
        $this->assertNotAChatInbox($firstInboxId);
        $this->assertNotAChatInbox($secondInboxId);

        return $this->page(Message::query()->betweenInboxes($firstInboxId, $secondInboxId), $olderCursor, $limit);
    }

    public function history(string $inboxId, string|null $olderCursor, int $limit): MessagePage
    {
        if (InboxRecord::isChatInbox($inboxId)) {
            return $this->timeline($inboxId, $olderCursor, $limit);
        }

        return $this->page(Message::query()->ofInbox($inboxId), $olderCursor, $limit);
    }

    public function timeline(string $inboxId, string|null $olderCursor, int $limit): MessagePage
    {
        $pageSize = max(1, min($limit, MessagePage::DEFAULT_LIMIT));
        $positioned = fn () => Message::query()->toInbox($inboxId)->ofType(MessageType::Chat)->withTimelinePosition();
        $cursor = $olderCursor === null ? null : $positioned()->whereKey($olderCursor)->first();

        $rows = $positioned()
            ->when($cursor !== null, fn (Builder $older) => $older->beforePosition($cursor->timeline_position))
            ->orderByDesc('inbox_timeline_events.sequence')
            ->limit($pageSize + 1)
            ->get();

        $shown = $rows->take($pageSize);

        return MessagePage::from([
            'messages' => $this->viewsOf(array_values($shown->reverse()->all())),
            'olderCursor' => $rows->count() > $pageSize ? $shown->last()?->id : null,
        ]);
    }

    public function counts(string $inboxId): InboxCounts
    {
        $incoming = fn () => Message::query()->toInbox($inboxId);
        $reader = ActorIdentity::of($this->actors->actor());

        $waitingIds = $incoming()
            ->waitingFor($reader)
            ->readLimit(MessagePage::LARGEST_LIMIT * 10)
            ->pluck('id')
            ->all();

        $claimed = count($this->proved->validClaimsOn(Message::LINK_TYPE, array_values($waitingIds)));

        return new InboxCounts(
            $incoming()->unreadBy($reader)->distinct()->count('id'),
            count($waitingIds) - $claimed,
            $claimed,
        );
    }

    public function inspect(string $inboxId, string|null $olderCursor, int $limit): MessagePage
    {
        $this->authorizer->authorize(MessageAdministrationPolicy::class, Message::class, AccessType::Read);
        $this->assertNotAChatInbox($inboxId);

        return $this->page(Message::query()->acrossInboxes()->ofInbox($inboxId), $olderCursor, $limit);
    }

    public function sitsAt(string $inboxId): bool
    {
        $actor = ActorIdentity::of($this->actors->actor());

        return in_array($inboxId, $this->members->inboxIdsOf($actor)->pluck('inbox_id')->all(), true);
    }

    public function ownInboxes(): array
    {
        $inboxIds = $this->members
            ->inboxIdsOf(ActorIdentity::of($this->actors->actor()))
            ->limit(MessagePage::LARGEST_LIMIT)
            ->pluck('inbox_id')
            ->all();

        return array_values(array_map(fn (string $inboxId) => new InboxView(
            $inboxId,
            $this->inboxes->resolve($inboxId)->inboxLabel(),
            $this->counts($inboxId),
        ), array_map(strval(...), $inboxIds)));
    }

    public function wakeStatus(string $messageId): array
    {
        $message = Message::query()->find($messageId);

        if ($message === null || ! $message->isWrittenBy(ActorIdentity::of($this->actors->actor()))) {
            throw MessageMissing::forId($messageId);
        }

        $woken = MessageAttention::query()
            ->where('origin_type', AttentionOrigin::MESSAGE)
            ->where('origin_id', $message->id)
            ->limit(InboxMembers::LIMIT)
            ->get()
            ->map(fn (MessageAttention $attention) => $attention->wakeStatus);

        $unsettled = ReceiptDelivery::query()
            ->unwokenFor($message->id)
            ->with('receipt.interval')
            ->limit(InboxMembers::LIMIT)
            ->get()
            ->map(fn (ReceiptDelivery $delivery) => $delivery->wakeStatus);

        return [...$woken->all(), ...$unsettled->all()];
    }

    /**
     * @throws ChatInboxRefused
     */
    private function assertNotAChatInbox(string $inboxId): void
    {
        if (InboxRecord::isChatInbox($inboxId)) {
            throw ChatInboxRefused::forInbox($inboxId);
        }
    }

    /**
     * @param  Builder<Message>  $query
     */
    private function page(Builder $query, string|null $olderCursor, int $limit): MessagePage
    {
        $pageSize = max(1, min($limit, MessagePage::LARGEST_LIMIT));
        $cursor = $olderCursor === null ? null : (clone $query)->whereKey($olderCursor)->first();

        $rows = $query
            ->when($cursor !== null, fn (Builder $older) => $older->olderThan($cursor))
            ->orderByDesc('created_at')
            ->orderByDesc('id')
            ->limit($pageSize + 1)
            ->get();

        $shown = $rows->take($pageSize);

        return MessagePage::from([
            'messages' => $this->viewsOf(array_values($shown->reverse()->all())),
            'olderCursor' => $rows->count() > $pageSize ? $shown->last()?->id : null,
        ]);
    }

    /**
     * The views of these messages, with the labels of their inboxes and authors and the claims on them read once.
     *
     * @param  list<Message>  $messages
     * @return list<MessageView>
     */
    private function viewsOf(array $messages): array
    {
        $inboxIds = array_values(array_unique(array_merge(
            array_map(fn (Message $message) => $message->source_inbox_id, $messages),
            array_map(fn (Message $message) => $message->destination_inbox_id, $messages),
        )));

        $inboxLabels = [];

        foreach ($inboxIds as $inboxId) {
            $inboxLabels[$inboxId] = $this->inboxes->resolve($inboxId)->inboxLabel();
        }

        $authors = $this->labels->labelsFor(array_map(fn (Message $message) => $message->author, $messages));

        $claims = $this->proved->validClaimsOn(
            Message::LINK_TYPE,
            array_map(fn (Message $message) => $message->id, $messages),
        );

        $holderFields = array_map(fn ($claim) => ['claimHolder' => MessageClaimHolder::ofClaim($claim)], $claims);

        $hiddenParents = $this->hiddenChatParents($messages);
        $originalFields = $this->replyOriginalFields($messages);
        $chatFields = $this->chatFieldsOf($messages, $hiddenParents);

        $requestKeys = CommandReceipt::readableKeysOf(array_values(array_unique(
            array_map(fn (Message $message) => $message->origin_receipt_id, $messages),
        )));

        return array_map(fn (Message $message) => MessageView::from([
            'id' => $message->id,
            'sourceInboxId' => $message->source_inbox_id,
            'sourceInboxLabel' => $inboxLabels[$message->source_inbox_id],
            'destinationInboxId' => $message->destination_inbox_id,
            'destinationInboxLabel' => $inboxLabels[$message->destination_inbox_id],
            'authorType' => $message->sender_type,
            'authorId' => $message->sender_id,
            'authorLabel' => $authors->nameOf($message->author),
            'body' => $message->body,
            'state' => $message->state,
            'stateVersion' => $message->state_version,
            'replyToId' => in_array($message->reply_to_id, $hiddenParents, true) ? null : $message->reply_to_id,
            'isReplyUnavailable' => in_array($message->reply_to_id, $hiddenParents, true),
            'answerId' => $message->answer_message_id,
            'firstReader' => $message->firstRead,
            ...$holderFields[$message->id] ?? [],
            ...$originalFields[$message->reply_to_id] ?? [],
            'sentAt' => (string) $message->created_at?->toIso8601String(),
            'requestKey' => $requestKeys[$message->origin_receipt_id] ?? null,
            ...$chatFields[$message->id] ?? [],
        ]), $messages);
    }

    /**
     * The view fields of the parents of chat replies that the reader may see, keyed by the parent's id, as the reply
     * line shows them.
     *
     * @param  list<Message>  $messages
     * @return array<string, array{replyOriginal: ReplyOriginal}>
     */
    private function replyOriginalFields(array $messages): array
    {
        $parentIds = array_values(array_unique(array_filter(array_map(
            fn (Message $message) => $message->isChat() ? $message->reply_to_id : null,
            $messages,
        ))));

        if ($parentIds === []) {
            return [];
        }

        $parents = array_values(Message::query()->whereKey($parentIds)->limit(count($parentIds))->get()->all());
        $authors = $this->labels->labelsFor(array_map(fn (Message $parent) => $parent->author, $parents));
        $originals = [];

        foreach ($parents as $parent) {
            $author = $parent->author;

            $originals[$parent->id]['replyOriginal'] = ReplyOriginal::from([
                'actor' => "{$author->type->value}:{$author->id}",
                'label' => $authors->nameOf($author) ?? "{$author->type->value}:{$author->id}",
                'excerpt' => Str::limit(Str::squish($parent->body), ReplyOriginal::EXCERPT_LIMIT),
            ]);
        }

        return $originals;
    }

    /**
     * The reply parents and user roots of chat messages that the reader may not see: shown as unavailable, never by
     * id or text.
     *
     * @param  list<Message>  $messages
     * @return list<string>
     */
    private function hiddenChatParents(array $messages): array
    {
        $parentIds = array_values(array_unique(array_filter(array_merge(...array_map(
            fn (Message $message) => $message->isChat() ? [$message->reply_to_id, $message->user_root_id] : [],
            $messages,
        )))));

        if ($parentIds === []) {
            return [];
        }

        $visible = Message::query()->whereKey($parentIds)->pluck('id')->all();

        return array_values(array_diff($parentIds, $visible));
    }

    /**
     * The chat fields of each chat message, keyed by its id: its timeline position, its user root unless that is
     * hidden, whom it addresses and whether the viewer was shown it through its active interval.
     *
     * @param  list<Message>  $messages
     * @param  list<string>  $hiddenParents
     * @return array<string, array<string, mixed>>
     */
    private function chatFieldsOf(array $messages, array $hiddenParents): array
    {
        $chat = array_values(array_filter($messages, fn (Message $message) => $message->isChat()));

        if ($chat === []) {
            return [];
        }

        $sequences = TimelineEvent::query()
            ->whereKey(array_map(fn (Message $message) => $message->timeline_event_id, $chat))
            ->pluck('sequence', 'id')
            ->all();

        $viewer = ActorIdentity::of($this->actors->actor());

        $shown = Message::query()
            ->whereKey(array_map(fn (Message $message) => $message->id, $chat))
            ->receivedNowBy($viewer)
            ->whereNotIn('id', Message::query()->whereKey(array_map(fn (Message $message) => $message->id, $chat))
                ->unpresentedTo($viewer)
                ->select('id'))
            ->pluck('id')
            ->all();

        $fields = [];

        foreach ($chat as $message) {
            $fields[$message->id] = [
                'sequence' => (int) $sequences[$message->timeline_event_id],
                'userRootId' => in_array($message->user_root_id, $hiddenParents, true) ? null : $message->user_root_id,
                'addresseeType' => $message->addressee_type,
                'addresseeId' => $message->addressee_id,
                'respondentType' => $message->respondent_type,
                'respondentId' => $message->respondent_id,
                'shownToViewer' => in_array($message->id, $shown, true),
            ];
        }

        return $fields;
    }
}
