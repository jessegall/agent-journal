<?php

declare(strict_types=1);

namespace App\Profiles\Console;

use App\Bus\Contracts\CommandBus;
use App\Bus\Support\ConsoleOwner;
use App\Profiles\Commands\ActivateProfiles;
use App\Profiles\Support\ProfileProposal;
use App\Profiles\Values\ActivatedProfile;
use Illuminate\Console\Command;
use Illuminate\Contracts\Config\Repository;

/**
 * The local owner activates the proposal in config/profiles.php: it is checked whole, and each profile gets its next
 * revision only when every one passes.
 */
final class ProfileActivateCommand extends Command
{
    protected $signature = 'profile:activate';

    protected $description = 'Activate the profile proposal in config/profiles.php';

    public function handle(ConsoleOwner $owner, CommandBus $commands, Repository $config): int
    {
        $owner->actAsOwner();
        $proposal = ProfileProposal::fromConfiguration((array) $config->get('profiles', []));
        $activation = $commands->run(new ActivateProfiles($proposal));

        $this->line("Configuration {$activation->configurationHash}");

        foreach ($activation->profiles as $profile) {
            $this->line($this->describe($profile));
        }

        return self::SUCCESS;
    }

    private function describe(ActivatedProfile $profile): string
    {
        return "{$profile->key}: revision {$profile->revision}, {$profile->change->value}";
    }
}
