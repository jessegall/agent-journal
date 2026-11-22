<?php

declare(strict_types=1);

namespace App\Commands\RevokeProfiles;

use App\Commands\FenceProfileRevision\FenceProfileRevisionCommand;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Bus\CommandFacts;
use App\Contracts\Bus\CommandHandler;
use App\Events\ProfileRevisionRevoked;
use App\Models\Profile;
use App\Models\ProfileRevision;
use App\Values\ProfileKey;

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
