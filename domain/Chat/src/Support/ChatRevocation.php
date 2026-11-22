<?php

declare(strict_types=1);

namespace Domain\Chat\Support;

use App\Actors\Contracts\ChatEligibility;
use App\Actors\Contracts\ChatParticipationEnding;
use App\Actors\Enums\ChatPermission;
use App\Actors\Support\ActorIdentity;
use App\Communication\Contracts\InboxResolver;
use App\Communication\Enums\LeaveReason;
use App\Communication\Support\ChatDepartures;
use App\Communication\Support\ChatInboxes;
use App\Communication\Support\ChatInterval;
use App\Communication\Support\InboxIntervals;
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
    public function __construct(
        private ChatInboxes $chats,
        private InboxResolver $inboxes,
        private InboxIntervals $intervals,
        private ChatDepartures $departures,
        private ChatEligibility $eligibility,
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

    /**
     * @param  Builder<Conversation>  $chats
     */
    private function endIn(ActorIdentity $user, Builder $chats): void
    {
        foreach ($chats->orderBy('inbox_id')->get() as $conversation) {
            $this->endOne($user, $conversation);
        }
    }

    private function endOne(ActorIdentity $user, Conversation $conversation): void
    {
        $inbox = $this->inboxes->resolve($conversation->inbox_id);
        $this->inboxes->accessFor($inbox)->lockExclusive($inbox);
        $interval = $this->chats->activeInterval($inbox, $user);

        if (! $conversation->isOwnedBy($user)) {
            $this->departures->depart($interval, LeaveReason::Revoked);

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
        $this->departures->depart($interval, LeaveReason::Revoked);
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
