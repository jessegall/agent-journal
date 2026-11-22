<?php

declare(strict_types=1);

namespace Domain\Access\Support;

use App\Actors\Contracts\ChatEligibility;
use App\Actors\Enums\ChatPermission;
use App\Actors\Support\ActorIdentity;
use Domain\Access\Models\EnvironmentUserGrant;
use Domain\Access\Models\User;

/**
 * Chat eligibility from environment grants: the owner holds every permission without one, any other user what its
 * active grant allows, and a disabled account or an actor that is not a user nothing.
 */
final readonly class EnvironmentChatEligibility implements ChatEligibility
{
    public function __construct(private AccessSettings $settings) {}

    public function lockAdmission(ActorIdentity $user, string|null $environmentId): void
    {
        if (! $user->type->isUser()) {
            return;
        }

        User::query()->whereKey($user->id)->lockForUpdate()->first();
        EnvironmentUserGrant::query()->activeFor($user->id, $environmentId)->lockForUpdate()->first();
    }

    public function isAdmitted(ActorIdentity $user, string|null $environmentId): bool
    {
        if (! $this->isActiveUser($user)) {
            return false;
        }

        return $this->isOwner($user)
            || EnvironmentUserGrant::query()->activeFor($user->id, $environmentId)->exists();
    }

    public function holds(ActorIdentity $user, ChatPermission $permission, string|null $environmentId): bool
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
            ->where(ChatPermission::ReceiveInvitations->column(), true)
            ->select('user_id');

        return array_values(array_map(strval(...), User::query()
            ->whereNull('disabled_at')
            ->where(fn ($users) => $users->whereIn('id', $granted)->orWhere('id', $this->settings->ownerId))
            ->orderBy('name')
            ->limit($limit)
            ->pluck('id')
            ->all()));
    }

    private function isActiveUser(ActorIdentity $user): bool
    {
        return $user->type->isUser()
            && User::query()->whereKey($user->id)->whereNull('disabled_at')->exists();
    }

    private function isOwner(ActorIdentity $user): bool
    {
        return $this->settings->ownerId !== null && $user->id === $this->settings->ownerId;
    }
}
