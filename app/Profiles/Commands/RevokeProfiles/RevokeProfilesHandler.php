<?php

declare(strict_types=1);

namespace App\Profiles\Commands\RevokeProfiles;

use App\Bus\Contracts\CommandBus;
use App\Bus\Contracts\CommandFacts;
use App\Bus\Contracts\CommandHandler;
use App\Events\Accounts\ProfileRevisionRevoked;
use App\Models\Profiles\Profile;
use App\Models\Profiles\ProfileRevision;
use App\Sessions\Commands\HoldProfileRevision\HoldProfileRevisionCommand;
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
        $profiles = array_map(Profile::findLockedByKey(...), $command->keys);

        foreach ($profiles as $profile) {
            $revision = ProfileRevision::findCurrentOf($profile);
            $profile->retire();
            $this->commands->run(new HoldProfileRevisionCommand($profile->key, $revision->revision));

            $this->facts->publishAfterCommit(new ProfileRevisionRevoked(
                ProfileKey::from($profile->key),
                $revision->revision,
                $revision->id,
            ));
        }

        return count($profiles);
    }
}
