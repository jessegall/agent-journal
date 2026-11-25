<?php

declare(strict_types=1);

namespace App\Support\Access;

use App\Contracts\Actors\CurrentActor;
use App\Contracts\Inboxes\InboxParticipationEnding;
use App\Enums\Messages\InboxPermission;
use App\Models\Access\EnvironmentUserGrant;
use App\Models\Access\User;
use App\Support\ActorReference;
use Carbon\CarbonImmutable;

/**
 * Granting and revoking a user's admission to an environment and disabling an account, each with its consequence,
 * inside the command that asked for it: the grant row and the account are locked first, then every inbox the user
 * lost ends for it, so no read slips in between.
 */
final readonly class EnvironmentAccess
{
    public function __construct(
        private InboxParticipationEnding $inboxes,
        private CurrentActor $actors,
    ) {}

    /**
     * @param  list<InboxPermission>  $permissions
     */
    public function grant(string $userId, string|null $environmentId, array $permissions): void
    {
        $now = CarbonImmutable::now();
        $grant = EnvironmentUserGrant::query()->activeFor($userId, $environmentId)->lockForUpdate()->first();

        if ($grant !== null) {
            $grant->revoke($now);
        }

        $user = User::query()->findOrFail($userId);

        EnvironmentUserGrant::create(
            $user,
            $environmentId,
            $permissions,
            ActorReference::of($this->actors->actor()),
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
        $user = User::query()->findOrFail($userId);

        $this->inboxes->endInEnvironment(ActorReference::of($user), $environmentId);
    }

    public function disable(string $userId): void
    {
        $user = User::findLockedById($userId);
        $user->disable(CarbonImmutable::now());
        $this->inboxes->endEverywhere(ActorReference::of($user));
    }
}
