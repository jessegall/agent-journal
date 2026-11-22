<?php

declare(strict_types=1);

namespace Domain\Access\Support;

use App\Contracts\ChatParticipationEnding;
use App\Contracts\CurrentActor;
use App\Enums\ChatPermission;
use App\Support\ActorIdentity;
use Carbon\CarbonImmutable;
use Domain\Access\Models\EnvironmentUserGrant;
use Domain\Access\Models\User;

/**
 * Granting and revoking a user's admission to an environment and disabling an account, each with its consequence,
 * inside the command that asked for it: the grant row and the account are locked first, then every chat the user
 * lost ends for it, so no read slips in between.
 */
final readonly class EnvironmentAccess
{
    public function __construct(
        private ChatParticipationEnding $chats,
        private CurrentActor $actors,
    ) {}

    /**
     * @param  list<ChatPermission>  $permissions
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
        $user = User::query()->whereKey($userId)->lockForUpdate()->firstOrFail();
        $user->disable(CarbonImmutable::now());
        $this->chats->endEverywhere(ActorIdentity::of($user));
    }
}
