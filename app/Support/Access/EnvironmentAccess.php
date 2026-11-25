<?php

declare(strict_types=1);

namespace App\Support\Access;

use App\Contracts\Actors\CurrentActor;
use App\Contracts\Inboxes\InboxParticipationEnding;
use App\Enums\Messages\InboxPermission;
use App\Support\ActorIdentity;
use Carbon\CarbonImmutable;
use App\Models\Access\EnvironmentUserGrant;
use App\Models\Access\User;

/**
 * Granting and revoking a user's admission to an environment and disabling an account, each with its consequence,
 * inside the command that asked for it: the grant row and the account are locked first, then every chat the user
 * lost ends for it, so no read slips in between.
 */
final readonly class EnvironmentAccess
{
    public function __construct(
        private InboxParticipationEnding $chats,
        private CurrentActor $actors,
    ) {}

    /**
     * @param  list<InboxPermission>  $permissions
     */
    public function grant(string $userId, string|null $environmentId, array $permissions): void
    {
        $now = CarbonImmutable::now();
        EnvironmentUserGrant::query()->activeFor($userId, $environmentId)->lockForUpdate()->first()?->revoke($now);

        EnvironmentUserGrant::create(
            User::query()->findOrFail($userId),
            $environmentId,
            $permissions,
            ActorIdentity::of($this->actors->actor()),
            $now,
        );
    }

    public function revoke(string $userId, string|null $environmentId): void
    {
        $grant = EnvironmentUserGrant::query()->activeFor($userId, $environmentId)->lockForUpdate()->first();

        if ($grant === null) {
            return;
        }

        $grant->revoke(CarbonImmutable::now());
        $this->chats->endInEnvironment(ActorIdentity::of(User::query()->findOrFail($userId)), $environmentId);
    }

    public function disable(string $userId): void
    {
        $user = User::lockedById($userId);
        $user->disable(CarbonImmutable::now());
        $this->chats->endEverywhere(ActorIdentity::of($user));
    }
}
