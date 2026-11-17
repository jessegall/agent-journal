<?php

declare(strict_types=1);

namespace App\Domain\Access\Support;

use App\Core\Actors\Contracts\CurrentActor;
use App\Core\Actors\Enums\ActorType;
use App\Core\Actors\Support\ActorIdentity;
use App\Core\Assignments\Contracts\Assignee;
use App\Core\Assignments\Contracts\AssigneeProvider;
use App\Core\Assignments\Exceptions\AssigneeUnavailable;
use App\Core\Assignments\Support\AssigneeList;
use App\Core\Assignments\Support\AssigneeName;
use App\Core\Assignments\Support\Page;
use App\Core\Web\Contracts\JournalAccessPolicy;
use App\Domain\Access\Models\User;

/**
 * Users as holders of work: only a user the journal admits now may receive work, and names are display names, never
 * an email, so a former owner keeps their name on the records they held.
 */
final readonly class UserAssignees implements AssigneeProvider
{
    public function __construct(
        private CurrentActor $actors,
        private JournalAccessPolicy $access,
    ) {}

    /**
     * @throws AssigneeUnavailable
     */
    public function requireEligible(ActorIdentity $recipient): Assignee
    {
        $this->actors->actor();

        if ($recipient->type !== ActorType::User) {
            throw AssigneeUnavailable::forActor($recipient);
        }

        $user = User::query()->whereKey($recipient->id)->sharedLock()->first() ?? throw AssigneeUnavailable::forActor($recipient);

        if (! $this->access->allows($user)) {
            throw AssigneeUnavailable::forActor($recipient);
        }

        return $user;
    }

    /**
     * @param  list<ActorIdentity>  $actors
     * @return list<AssigneeName>
     */
    public function names(array $actors): array
    {
        $this->actors->actor();
        $ids = array_values(array_unique(array_map(fn (ActorIdentity $actor) => $actor->id, array_filter($actors, fn (ActorIdentity $actor) => $actor->type === ActorType::User))));

        return array_values(User::query()->whereKey($ids)->orderBy('id')->get()
            ->map(fn (User $user) => new AssigneeName(ActorIdentity::of($user), $user->name))
            ->all());
    }

    public function eligible(Page $page): AssigneeList
    {
        $this->actors->actor();
        $ids = array_values(array_filter($this->access->allowedUserIds(), fn (int $id) => $page->afterId === null || $id > $page->afterId));
        sort($ids);
        $shownIds = array_slice($ids, 0, $page->limit);

        return new AssigneeList(
            $this->names(array_map(fn (int $id) => new ActorIdentity(ActorType::User, $id), $shownIds)),
            $this->nextAfterId($shownIds, count($ids) > $page->limit),
        );
    }

    /**
     * @param  list<int>  $shownIds
     */
    private function nextAfterId(array $shownIds, bool $hasMore): int|null
    {
        if (! $hasMore || $shownIds === []) {
            return null;
        }

        return max($shownIds);
    }
}
