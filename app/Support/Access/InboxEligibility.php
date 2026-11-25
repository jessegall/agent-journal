<?php

declare(strict_types=1);

namespace App\Support\Access;

use App\Contracts\Inboxes\InboxEligibility as InboxEligibilityContract;
use App\Enums\Messages\InboxPermission;
use App\Models\Access\EnvironmentUserGrant;
use App\Models\Access\User;
use App\Support\ActorReference;

/**
 * Inbox eligibility from environment grants: the owner holds every permission without one, any other user what its
 * active grant allows, and a disabled account or an actor that is not a user nothing.
 */
final readonly class InboxEligibility implements InboxEligibilityContract
{
    public function __construct(private AccessSettings $settings) {}

    public function lockAdmission(ActorReference $user, string|null $environmentId): void
    {
        if (! $user->isUser()) {
            return;
        }

        User::query()->whereKey($user->id)->lockForUpdate()->first();
        EnvironmentUserGrant::query()->activeFor($user->id, $environmentId)->lockForUpdate()->first();
    }

    public function isAdmitted(ActorReference $user, string|null $environmentId): bool
    {
        if (! $this->isActiveUser($user)) {
            return false;
        }

        return $this->isOwner($user)
            || EnvironmentUserGrant::query()->activeFor($user->id, $environmentId)->exists();
    }

    public function holds(ActorReference $user, InboxPermission $permission, string|null $environmentId): bool
    {
        if (! $this->isActiveUser($user)) {
            return false;
        }

        if ($this->isOwner($user)) {
            return true;
        }

        $grant = EnvironmentUserGrant::query()->activeFor($user->id, $environmentId)->first();

        return $grant !== null && $grant->allows($permission);
    }

    public function invitableUserIds(string|null $environmentId, int $limit): array
    {
        $granted = EnvironmentUserGrant::query()
            ->inEnvironment($environmentId)
            ->allowing(InboxPermission::ReceiveInvitations)
            ->userIds();

        return array_values(array_map(strval(...), User::query()
            ->whereNull('disabled_at')
            ->where(fn ($users) => $users->whereIn('id', $granted)->orWhere('id', $this->settings->ownerId))
            ->orderBy('name')
            ->limit($limit)
            ->pluck('id')
            ->all()));
    }

    private function isActiveUser(ActorReference $user): bool
    {
        return $user->isUser()
            && User::query()->whereKey($user->id)->whereNull('disabled_at')->exists();
    }

    private function isOwner(ActorReference $user): bool
    {
        return $this->settings->ownerId !== null && $user->id === $this->settings->ownerId;
    }
}
