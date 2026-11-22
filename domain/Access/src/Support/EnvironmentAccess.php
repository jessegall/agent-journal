<?php

declare(strict_types=1);

namespace Domain\Access\Support;

use App\Actors\Contracts\ChatParticipationEnding;
use App\Actors\Support\ActorIdentity;
use Carbon\CarbonImmutable;
use Domain\Access\Models\EnvironmentUserGrant;
use Domain\Access\Models\User;
use Illuminate\Database\ConnectionInterface;

/**
 * Revoking a user's grant and disabling an account, each in one transaction with its consequence: the grant row and
 * the account are locked first, then every chat the user lost ends for it, so no read slips in between.
 */
final readonly class EnvironmentAccess
{
    public function __construct(
        private ConnectionInterface $database,
        private ChatParticipationEnding $chats,
    ) {}

    public function revoke(User $user, string|null $environmentId, CarbonImmutable $at): void
    {
        $this->database->transaction(function () use ($user, $environmentId, $at): void {
            $grant = EnvironmentUserGrant::query()->activeFor($user->id, $environmentId)->lockForUpdate()->first();

            if ($grant === null) {
                return;
            }

            $grant->revoke($at);
            $this->chats->endInEnvironment(ActorIdentity::of($user), $environmentId);
        });
    }

    public function disable(User $user, CarbonImmutable $at): void
    {
        $this->database->transaction(function () use ($user, $at): void {
            User::query()->whereKey($user->id)->lockForUpdate()->first();
            $user->disable($at);
            $this->chats->endEverywhere(ActorIdentity::of($user));
        });
    }
}
