<?php

declare(strict_types=1);

namespace App\Profiles\Handlers;

use App\Actors\Contracts\CurrentAuthorizer;
use App\Agents\Commands\FenceProfileRevision;
use App\Bus\Contracts\CommandBus;
use App\Contracts\CommandHandler;
use App\Profiles\Commands\RevokeProfiles;
use App\Profiles\Enums\ProfileAbility;
use App\Profiles\Events\ProfileRevisionRevoked;
use App\Profiles\Models\Profile;
use App\Profiles\Models\ProfileRevision;
use App\Profiles\Policies\ProfileAdministrationPolicy;
use App\Profiles\Values\ProfileKey;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Retires each profile, retains the fence of the sessions launched from its current revision in the same transaction,
 * and tells other subscribers once the revocation committed.
 */
final readonly class RevokeProfilesHandler implements CommandHandler
{
    public function __construct(
        private CurrentAuthorizer $administration,
        private CommandBus $commands,
        private Dispatcher $events,
    ) {}

    public function handle(RevokeProfiles $command): int
    {
        $this->administration->authorize(ProfileAdministrationPolicy::class, Profile::class, ProfileAbility::Administer);
        $profiles = array_map(Profile::lockByKey(...), $command->keys);

        foreach ($profiles as $profile) {
            $revision = ProfileRevision::currentOf($profile);
            $profile->retire();
            $this->commands->run(new FenceProfileRevision($revision->id));
            $this->events->dispatch(new ProfileRevisionRevoked(
                ProfileKey::from($profile->key),
                $revision->revision,
                $revision->id,
            ));
        }

        return count($profiles);
    }
}
