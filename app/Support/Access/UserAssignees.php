<?php

declare(strict_types=1);

namespace App\Support\Access;

use App\Contracts\Actors\CurrentActor;
use App\Contracts\Admission\JournalAdmission;
use App\Contracts\Assignments\Assignee;
use App\Contracts\Assignments\AssigneeProvider;
use App\Contracts\Messages\AdmittedRecipients;
use App\Enums\Assignments\ActorType;
use App\Exceptions\AssigneeUnavailable;
use App\Support\AssigneeIdentity;
use App\Support\AssigneeList;
use App\Support\AssigneeName;
use App\Support\IdListPage;
use App\Models\Access\User;

/**
 * Users as holders of work: only a user the journal admits now may receive work, and names are display names, never
 * an email, so a former owner keeps their name on the records they held.
 */
final readonly class UserAssignees implements AssigneeProvider
{
    public function __construct(
        private CurrentActor $actors,
        private JournalAdmission $admission,
        private AdmittedRecipients $recipients,
    ) {}

    /**
     * @throws AssigneeUnavailable
     */
    public function requireEligible(AssigneeIdentity $recipient): Assignee
    {
        $this->actors->actor();

        return $this->admitted(User::query()->whereKey($recipient->id)->sharedLock()->first(), $recipient);
    }

    public function requireExclusive(AssigneeIdentity $recipient): Assignee
    {
        $this->actors->actor();

        return $this->admitted(User::query()->whereKey($recipient->id)->lockForUpdate()->first(), $recipient);
    }

    /**
     * @throws AssigneeUnavailable
     */
    private function admitted(User|null $user, AssigneeIdentity $recipient): User
    {
        if ($user === null || ! $this->admission->admits($user)) {
            throw AssigneeUnavailable::forActor($recipient);
        }

        return $user;
    }

    /**
     * @param  list<AssigneeIdentity>  $actors
     * @return list<AssigneeName>
     */
    public function names(array $actors): array
    {
        $this->actors->actor();
        $ids = array_values(array_unique(array_map(fn (AssigneeIdentity $actor) => $actor->id, $actors)));

        return array_values(User::query()->whereKey($ids)->readExactly(count($ids))->orderBy('id')->get()
            ->map(fn (User $user) => new AssigneeName(AssigneeIdentity::of($user), $user->name))
            ->all());
    }

    public function eligible(IdListPage $page): AssigneeList
    {
        $this->actors->actor();

        $ids = array_values(
            array_filter(
                $this->recipients->userIds(),
                fn (string $id) => $page->afterId === null || $id > $page->afterId,
            ),
        );

        sort($ids);
        $shownIds = array_slice($ids, 0, $page->limit);

        return new AssigneeList(
            $this->names(array_map(fn (string $id) => new AssigneeIdentity(ActorType::User->value, $id), $shownIds)),
            $this->nextAfterId($shownIds, count($ids) > $page->limit),
        );
    }

    /**
     * @param  list<string>  $shownIds
     */
    private function nextAfterId(array $shownIds, bool $hasMore): string|null
    {
        if (! $hasMore || $shownIds === []) {
            return null;
        }

        return max($shownIds);
    }
}
