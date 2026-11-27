<?php

declare(strict_types=1);

namespace Domain\Chat\Support;

use App\Actors\Contracts\ActorLabels;
use App\Actors\Contracts\CurrentActor;
use App\Bus\Contracts\CommandBus;
use App\Inboxes\Commands\OpenInbox\OpenInboxCommand;
use App\Inboxes\Contracts\InboxEligibility;
use App\Messages\Enums\InboxPermission;
use App\Models\Inboxes\Inbox;
use App\Models\Inboxes\InboxMember;
use App\Support\ActorReference;
use Domain\Chat\Contracts\PairChats as PairChatsContract;
use Domain\Chat\Exceptions\ChatUnavailable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Str;

/**
 * The chats as the chat domain sees them: a pair chat between a user and an agent, a group chat of users, each a core
 * inbox, and the ones the current actor is attached to.
 */
final readonly class PairChats implements PairChatsContract
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
    public function pairWith(ActorReference $actor): string
    {
        $viewer = $this->actors->actor();
        $members = [$viewer, $actor];
        $key = implode('|', array_map(fn (ActorReference $member) => $member->text(), $members));
        $sorted = array_map(fn (ActorReference $member) => $member->text(), $members);
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
     * @param  list<ActorReference>  $users
     */
    public function openGroup(string $title, array $users): string
    {
        $viewer = $this->actors->actor();

        return $this->commands->run(new OpenInboxCommand(self::GROUP_PROVIDER, (string) Str::ulid(), $title, [
            $viewer,
            ...$users,
        ]));
    }

    /**
     * The chat the current actor is attached to by its inbox id.
     *
     * @throws ChatUnavailable
     */
    public function attached(string $inboxId): Inbox
    {
        $inbox = Inbox::query()->whereKey($inboxId)->first();

        if ($inbox === null || ! InboxMember::isAttached($inbox->id, $this->actors->actor())) {
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
        $viewer = $this->actors->actor();

        $managesMembers = $this->eligibility->holds($viewer, InboxPermission::ManageMembers);

        if ($inbox->provider_key !== self::GROUP_PROVIDER || ! $managesMembers) {
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
        $viewer = $this->actors->actor();

        if (! $this->eligibility->holds($viewer, InboxPermission::OpenInboxes)) {
            throw ChatUnavailable::none();
        }
    }

    /**
     * Whether the viewer may open chats.
     */
    public function mayCreate(): bool
    {
        return $this->eligibility->holds($this->actors->actor(), InboxPermission::OpenInboxes);
    }

    /**
     * The chats the current actor is attached to now.
     *
     * @return Builder<Inbox>
     */
    public function joined(): Builder
    {
        return Inbox::query()
            ->withAnyProviderKey([self::PAIR_PROVIDER, self::GROUP_PROVIDER])
            ->attachedTo($this->actors->actor())
            ->oldestFirst();
    }
}
