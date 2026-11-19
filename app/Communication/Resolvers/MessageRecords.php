<?php

declare(strict_types=1);

namespace App\Communication\Resolvers;

use App\Actors\Contracts\ActorLabels;
use App\Actors\Contracts\CurrentActor;
use App\Actors\Contracts\CurrentAuthorizer;
use App\Actors\Support\ActorIdentity;
use App\Actors\Support\AttentionOrigin;
use App\Assignments\Support\ProvedClaims;
use App\Communication\Contracts\ConversationResolver;
use App\Communication\Contracts\InboxResolver;
use App\Communication\Contracts\MemberInboxes;
use App\Communication\Data\InboxCounts;
use App\Communication\Data\InboxView;
use App\Communication\Data\MessageClaimHolder;
use App\Communication\Data\MessagePage;
use App\Communication\Data\MessageView;
use App\Communication\Enums\MessageAbility;
use App\Communication\Enums\MessageState;
use App\Communication\Exceptions\MessageMissing;
use App\Communication\Models\Message;
use App\Communication\Models\MessageAttention;
use App\Communication\Policies\MessagePolicy;
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
        private InboxResolver $inboxes,
        private ActorLabels $labels,
        private MemberInboxes $members,
        private CurrentAuthorizer $authorizer,
    ) {}

    public function detail(string $messageId): MessageView
    {
        $message = Message::query()->find($messageId) ?? throw MessageMissing::forId($messageId);

        return $this->viewsOf([$message])[0];
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

    public function inspect(string $inboxId, string|null $olderCursor, int $limit): MessagePage
    {
        $this->authorizer->authorize(MessagePolicy::class, Message::class, MessageAbility::Inspect);

        return $this->page(Message::query()->withoutGlobalScopes()->ofInbox($inboxId), $olderCursor, $limit);
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
        $cursor = $olderCursor === null ? null : (clone $query)->whereKey($olderCursor)->first();
        $rows = $query
            ->when($cursor !== null, fn (Builder $older) => $older->olderThan($cursor))
            ->orderByDesc('created_at')
            ->orderByDesc('id')
            ->limit($pageSize + 1)
            ->get();
        $shown = $rows->take($pageSize);

        return new MessagePage(
            $this->viewsOf(array_values($shown->reverse()->all())),
            $rows->count() > $pageSize ? $shown->last()?->id : null,
        );
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

        $authors = $this->labels->labelsFor(array_map(fn (Message $message) => $message->author(), $messages));
        $claims = $this->proved->validClaimsOn(
            Message::LINK_TYPE,
            array_map(fn (Message $message) => $message->id, $messages),
        );

        $holderFields = array_map(fn ($claim) => ['claimHolder' => MessageClaimHolder::ofClaim($claim)], $claims);

        return array_map(fn (Message $message) => MessageView::from([
            'id' => $message->id,
            'sourceInboxId' => $message->source_inbox_id,
            'sourceInboxLabel' => $inboxLabels[$message->source_inbox_id],
            'destinationInboxId' => $message->destination_inbox_id,
            'destinationInboxLabel' => $inboxLabels[$message->destination_inbox_id],
            'authorType' => $message->sender_type,
            'authorId' => $message->sender_id,
            'authorLabel' => $authors->nameOf($message->author()),
            'body' => $message->body,
            'state' => $message->state,
            'stateVersion' => $message->state_version,
            'replyToId' => $message->reply_to_id,
            'answerId' => $message->answer_message_id,
            'firstReader' => $message->firstRead(),
            ...$holderFields[$message->id] ?? [],
            'sentAt' => (string) $message->created_at?->toIso8601String(),
        ]), $messages);
    }
}
