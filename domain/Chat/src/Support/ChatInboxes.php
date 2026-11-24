<?php

declare(strict_types=1);

namespace Domain\Chat\Support;

use App\Commands\Inboxes\OpenInbox\OpenInboxCommand;
use App\Contracts\Actors\ActorLabels;
use App\Contracts\Actors\CurrentActor;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Inboxes\InboxEligibility;
use App\Enums\InboxPermission;
use App\Models\Inboxes\Inbox;
use App\Models\Inboxes\InboxMember;
use App\Support\ActorIdentity;
use Domain\Chat\Contracts\PairChats;
use Domain\Chat\Exceptions\ChatUnavailable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Str;

/**
 * The chats as the chat domain sees them: a pair chat between a user and an agent, a group chat of users, each a core
 * inbox, and the ones the current actor is attached to.
 */
final readonly class ChatInboxes implements PairChats
{
    public const string PAIR_PROVIDER = 'chat.pair';

    public const string GROUP_PROVIDER = 'chat.group';

    public function __construct(
        private CurrentActor $actors,
        private CommandBus $commands,
        private ActorLabels $labels,
        private InboxEligibility $eligibility,
    ) {}

    /**
     * The pair chat of the current actor and the actor, opened the first time; returns its inbox id.
     */
    public function pairWith(ActorIdentity $actor): string
    {
        $viewer = ActorIdentity::of($this->actors->actor());
        $members = [$viewer, $actor];
        $key = implode('|', array_map(fn (ActorIdentity $member) => $member->text(), $members));
        $sorted = array_map(fn (ActorIdentity $member) => $member->text(), $members);
        sort($sorted);

        return $this->commands->run(new OpenInboxCommand(
            self::PAIR_PROVIDER,
            implode('|', $sorted),
            $this->labels->labelsFor([$actor])->nameOf($actor) ?? $key,
            $members,
        ));
    }

    /**
     * A new group chat of the current actor and the users, under the title; returns its inbox id.
     *
     * @param  list<ActorIdentity>  $users
     */
    public function openGroup(string $title, array $users): string
    {
        $viewer = ActorIdentity::of($this->actors->actor());

        return $this->commands->run(new OpenInboxCommand(self::GROUP_PROVIDER, (string) Str::ulid(), $title, [$viewer, ...$users]));
    }

    /**
     * The chat the current actor is attached to by its inbox id.
     *
     * @throws ChatUnavailable
     */
    public function attached(string $inboxId): Inbox
    {
        $inbox = Inbox::query()->whereKey($inboxId)->first();

        if ($inbox === null || ! InboxMember::isAttached($inbox->id, ActorIdentity::of($this->actors->actor()))) {
            throw ChatUnavailable::notAttached($inboxId);
        }

        return $inbox;
    }

    /**
     * Refuses a viewer who may not manage the members of the group chat.
     *
     * @throws ChatUnavailable
     */
    public function assertManages(string $inboxId): void
    {
        $inbox = $this->attached($inboxId);
        $viewer = ActorIdentity::of($this->actors->actor());

        if ($inbox->provider_key !== self::GROUP_PROVIDER || ! $this->eligibility->holds($viewer, InboxPermission::ManageMembers, null)) {
            throw ChatUnavailable::notAttached($inboxId);
        }
    }

    /**
     * Refuses a viewer who may not open chats.
     *
     * @throws ChatUnavailable
     */
    public function assertMayCreate(): void
    {
        $viewer = ActorIdentity::of($this->actors->actor());

        if (! $this->eligibility->holds($viewer, InboxPermission::OpenInboxes, null)) {
            throw ChatUnavailable::none();
        }
    }

    /**
     * Whether the viewer may open chats.
     */
    public function mayCreate(): bool
    {
        return $this->eligibility->holds(ActorIdentity::of($this->actors->actor()), InboxPermission::OpenInboxes, null);
    }

    /**
     * The chats the current actor is attached to now.
     *
     * @return Builder<Inbox>
     */
    public function joined(): Builder
    {
        return Inbox::query()
            ->whereIn('provider_key', [self::PAIR_PROVIDER, self::GROUP_PROVIDER])
            ->attachedTo(ActorIdentity::of($this->actors->actor()))
            ->orderBy('id');
    }
}
