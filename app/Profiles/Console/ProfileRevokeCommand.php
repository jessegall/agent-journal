<?php

declare(strict_types=1);

namespace App\Profiles\Console;

use App\Bus\Contracts\CommandBus;
use App\Bus\Support\ConsoleOwner;
use App\Profiles\Commands\RevokeProfiles;
use App\Profiles\Values\ProfileKey;
use Illuminate\Console\Command;

/**
 * The local owner revokes profiles: new launches can no longer choose them, and the sessions launched from their
 * current revisions are fenced.
 */
final class ProfileRevokeCommand extends Command
{
    protected $signature = 'profile:revoke {keys* : The stable keys of the profiles}';

    protected $description = 'Revoke profiles and fence the sessions launched from them';

    public function handle(ConsoleOwner $owner, CommandBus $commands): int
    {
        $owner->actAsOwner();
        $keys = array_map(fn (mixed $key) => ProfileKey::from((string) $key), (array) $this->argument('keys'));
        $revoked = $commands->run(new RevokeProfiles(array_values($keys)));

        $this->line("Revoked {$revoked} profiles.");

        return self::SUCCESS;
    }
}
