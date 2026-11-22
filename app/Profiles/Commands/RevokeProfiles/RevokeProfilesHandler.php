<?php

declare(strict_types=1);

namespace App\Profiles\Commands\RevokeProfiles;

use App\Agents\Commands\FenceProfileRevision\FenceProfileRevisionCommand;
use App\Bus\Contracts\CommandBus;
use App\Bus\Contracts\CommandFacts;
use App\Contracts\CommandHandler;
use App\Profiles\Events\ProfileRevisionRevoked;
use App\Profiles\Models\Profile;
use App\Profiles\Models\ProfileRevision;
use App\Profiles\Values\ProfileKey;

/**
 * Retires each profile, retains the fence of the sessions started from its current revision in the same transaction,
 * and tells other subscribers once the revocation committed.
 */
final readonly class RevokeProfilesHandler implements CommandHandler
{
    public function __construct(
        private CommandBus $commands,
        private CommandFacts $facts,
    ) {}

    public function handle(RevokeProfilesCommand $command): int
    {
        $profiles = array_map(Profile::lockByKey(...), $command->keys);

        foreach ($profiles as $profile) {
            $revision = ProfileRevision::currentOf($profile);
            $profile->retire();
            $this->commands->run(new FenceProfileRevisionCommand($profile->key, $revision->revision));

            $this->facts->publishAfterCommit(new ProfileRevisionRevoked(
                ProfileKey::from($profile->key),
                $revision->revision,
                $revision->id,
            ));
        }

        return count($profiles);
    }
}
