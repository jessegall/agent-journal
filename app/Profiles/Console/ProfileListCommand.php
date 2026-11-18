<?php

declare(strict_types=1);

namespace App\Profiles\Console;

use App\Profiles\Models\Profile;
use Illuminate\Console\Command;

/**
 * Lists the installation's profiles by key: label, current revision and whether new launches may still choose it.
 */
final class ProfileListCommand extends Command
{
    private const int ROWS = 100;

    protected $signature = 'profile:list';

    protected $description = 'List the profiles by key';

    public function handle(): int
    {
        $profiles = Profile::listed(self::ROWS);

        $this->table(['Key', 'Label', 'State'], array_map(fn (Profile $profile) => [$profile->key, $profile->label, $profile->isRetired() ? 'retired' : 'current'], $profiles));

        return self::SUCCESS;
    }
}
