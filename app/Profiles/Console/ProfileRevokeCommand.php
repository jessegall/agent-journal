<?php

declare(strict_types=1);

namespace App\Profiles\Console;

use App\Bus\Contracts\CommandBus;
use App\Bus\Support\ConsoleOwner;
use App\Profiles\Commands\RevokeProfiles\RevokeProfilesCommand;
use App\Profiles\Values\ProfileKey;
use Illuminate\Console\Command;

/**
 * The local owner revokes profiles: new starts can no longer choose them, and the sessions started from their
 * current revisions are fenced.
 */
final class ProfileRevokeCommand extends Command
{
    protected $signature = 'profile:revoke {keys* : The stable keys of the profiles}';

    protected $description = 'Revoke profiles and fence the sessions started from them';

    public function handle(ConsoleOwner $owner, CommandBus $commands): int
    {
        $owner->actAsOwner();
        $keys = array_map(fn (mixed $key) => ProfileKey::from((string) $key), (array) $this->argument('keys'));
        $revoked = $commands->run(new RevokeProfilesCommand(array_values($keys)));

        $this->line("Revoked {$revoked} profiles.");

        return self::SUCCESS;
    }
}
