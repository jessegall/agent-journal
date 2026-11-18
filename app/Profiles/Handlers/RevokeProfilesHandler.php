<?php

declare(strict_types=1);

namespace App\Profiles\Handlers;

use App\Contracts\CommandHandler;
use App\Profiles\Commands\RevokeProfiles;
use App\Profiles\Models\Profile;

final readonly class RevokeProfilesHandler implements CommandHandler
{
    public function handle(RevokeProfiles $command): int
    {
        $profiles = array_map(Profile::lockByKey(...), $command->keys);

        foreach ($profiles as $profile) {
            $profile->retire();
        }

        return count($profiles);
    }
}
