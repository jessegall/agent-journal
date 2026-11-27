<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Bus\ConsoleOwner;
use App\Bus\Contracts\CommandBus;
use App\Exceptions\ConsoleOwnerMissing;
use App\Profiles\Commands\ActivateProfiles\ActivateProfilesCommand;
use App\Profiles\ProfileProposal;
use App\Profiles\Values\ActivatedProfile;
use App\Profiles\Values\DraftExpectations;
use Illuminate\Console\Command;
use Illuminate\Container\Attributes\Config;

/**
 * The local owner activates the proposal in config/journal.php (profiles): it is checked whole, and each profile gets its next
 * revision only when every one passes.
 */
final class ProfileActivateCommand extends Command
{
    /**
     * A journal whose owner has not signed up yet has nobody to activate the profiles as: the install goes on, says
     * so, and the first install after the owner signs up activates them.
     */
    public const string NO_OWNER_YET = 'No owner has signed up yet, so the profiles are activated by the first install '
        .'after the owner signs up.';

    protected $signature = 'profile:activate {--draft=* : Expected revisions as profile=revision}';

    protected $description = 'Activate the built-in profiles and the profile proposal in config/journal.php (profiles)';

    /**
     * @param  array<string, mixed>  $profiles
     */
    public function handle(
        ConsoleOwner $owner,
        CommandBus $commands,
        #[Config('journal.profiles')]
        array $profiles,
    ): int {
        try {
            $owner->actAsOwner();
        } catch (ConsoleOwnerMissing) {
            $this->warn(self::NO_OWNER_YET);

            return self::SUCCESS;
        }

        $proposal = ProfileProposal::fromConfiguration($profiles)->withBuiltIns();
        $drafts = DraftExpectations::fromOptions(array_values(array_filter($this->option('draft'), is_string(...))));
        $activation = $commands->run(new ActivateProfilesCommand($proposal, $drafts));

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
