<?php

declare(strict_types=1);

namespace Domain\Chat\Support;

use App\Contracts\Chat\ChatDepartures;
use App\Contracts\Chat\ChatEligibility;
use App\Contracts\Chat\ChatInboxStore;
use App\Contracts\Chat\ChatParticipationEnding;
use App\Contracts\Chat\Inbox;
use App\Contracts\Chat\InboxIntervalWriter;
use App\Contracts\Chat\InboxResolver;
use App\Enums\ChatPermission;
use App\Enums\LeaveReason;
use App\Support\ActorIdentity;
use App\Support\ChatInterval;
use Carbon\CarbonImmutable;
use Domain\Chat\Enums\ConversationState;
use Domain\Chat\Models\Conversation;
use Illuminate\Database\Eloquent\Builder;

/**
 * Takes a user out of the chats it lost the right to be in, inside the revoking transaction and under each chat's
 * lock in inbox id order: its membership ends as a removal does, and a chat it owned passes to the earliest-joined
 * remaining user who may manage members, or closes when nobody may.
 */
final readonly class ChatRevocation implements ChatParticipationEnding
{
    /**
     * The most chats one revocation ends in its own transaction, so a user in many chats does not hold every chat's
     * lock for the whole pass.
     */
    public const int INLINE_CHAT_LIMIT = 100;

    public function __construct(
        private ChatInboxStore $chats,
        private InboxResolver $inboxes,
        private InboxIntervalWriter $intervals,
        private ChatDepartures $departures,
        private ChatEligibility $eligibility,
        private int $inlineChatLimit = self::INLINE_CHAT_LIMIT,
    ) {}

    public function endInEnvironment(ActorIdentity $user, string|null $environmentId): void
    {
        $this->endIn(
            $user,
            $this->joinedBy($user)->where(fn (Builder $chats) => $environmentId === null
                ? $chats->whereNull('environment_id')
                : $chats->where('environment_id', $environmentId)),
        );
    }

    public function endEverywhere(ActorIdentity $user): void
    {
        $this->endIn($user, $this->joinedBy($user));
    }

    public function endForRetirement(ActorIdentity $agent): void
    {
        $this->endIn($agent, $this->joinedBy($agent), LeaveReason::Retired);
    }

    /**
     * Ends the user's chats in inbox order, at most the inline limit of them in this transaction; the rest are marked
     * as owing a reconcile and left as they are. The user is refused in those at once: chat access admits only users
     * who may still take part.
     *
     * @param  Builder<Conversation>  $chats
     */
    private function endIn(ActorIdentity $user, Builder $chats, LeaveReason $reason = LeaveReason::Revoked): void
    {
        [$inline, $later] = $chats->orderBy('inbox_id')->get()->partition(
            fn (Conversation $conversation, int $position) => $position < $this->inlineChatLimit,
        );

        foreach ($inline as $conversation) {
            $this->endOne($user, $conversation, $reason);
        }

        foreach ($later as $conversation) {
            $conversation->markReconcilePending();
        }
    }

    /**
     * Settles a chat marked as owing a reconcile, under the exclusive lock its caller holds: every user no longer
     * admitted to it leaves as a revocation makes it leave, and the mark is cleared first, so the departures it
     * causes do not settle it again.
     */
    public function reconcile(Conversation $conversation): void
    {
        $conversation->clearReconcilePending();
        $inbox = $this->inboxes->resolve($conversation->inbox_id);

        $revoked = array_filter(
            $this->chats->activeIntervals($inbox),
            fn (ChatInterval $interval) => $interval->actor->isUser()
                && ! $this->eligibility->isAdmitted($interval->actor, $conversation->environment_id),
        );

        foreach ($revoked as $interval) {
            $this->endLocked($interval->actor, $conversation, $inbox, LeaveReason::Revoked);

            // A chat that closed with its owner's departure took every other membership with it.
            if (! $conversation->isOpen()) {
                return;
            }
        }
    }

    private function endOne(ActorIdentity $user, Conversation $conversation, LeaveReason $reason): void
    {
        $inbox = $this->inboxes->resolve($conversation->inbox_id);
        $this->inboxes->accessFor($inbox)->lockExclusive($inbox);
        $this->endLocked($user, $conversation, $inbox, $reason);
    }

    private function endLocked(ActorIdentity $user, Conversation $conversation, Inbox $inbox, LeaveReason $reason): void
    {
        $interval = $this->chats->activeInterval($inbox, $user);

        if (! $conversation->isOwnedBy($user)) {
            $this->departures->depart($interval, $reason);

            return;
        }

        $successor = $this->successorOf($interval, $conversation);

        if ($successor === null) {
            $this->departures->closeChat($inbox, $user);
            $conversation->close(CarbonImmutable::now());

            return;
        }

        $this->intervals->transfer($interval, $successor);
        $conversation->transferTo($successor->actor);
        $this->departures->depart($interval, $reason);
    }

    /**
     * The earliest-joined other user in the chat who may manage its members, if any.
     */
    private function successorOf(ChatInterval $owner, Conversation $conversation): ChatInterval|null
    {
        foreach ($this->chats->activeIntervals($this->inboxes->resolve($conversation->inbox_id)) as $member) {
            $isCandidate = ! $member->actor->isSameAs($owner->actor)
                && ! $member->actor->type->isAgent()
                && $this->eligibility->holds(
                    $member->actor,
                    ChatPermission::ManageMembers,
                    $conversation->environment_id,
                );

            if ($isCandidate) {
                return $member;
            }
        }

        return null;
    }

    /**
     * @return Builder<Conversation>
     */
    private function joinedBy(ActorIdentity $user): Builder
    {
        return Conversation::query()
            ->whereIn('inbox_id', $this->chats->memberInboxIds($user))
            ->where('state', ConversationState::Open);
    }
}
