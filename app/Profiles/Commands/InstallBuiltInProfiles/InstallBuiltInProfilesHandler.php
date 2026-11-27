<?php

declare(strict_types=1);

namespace App\Profiles\Commands\InstallBuiltInProfiles;

use App\Bus\Contracts\CommandHandler;
use App\Profiles\Commands\ActivateProfiles\ActivateProfilesHandler;
use App\Profiles\Exceptions\ProfilePolicyRefused;
use App\Profiles\ProfileProposal;
use App\Profiles\Values\ProfileActivation;
use Illuminate\Container\Attributes\Config;

/**
 * Activates the built-in profiles with the project's proposal the same way an owner's activation does; an unchanged
 * definition adds no revision.
 */
final readonly class InstallBuiltInProfilesHandler implements CommandHandler
{
    /**
     * @param  array<string, mixed>  $profiles
     */
    public function __construct(
        private ActivateProfilesHandler $activation,
        #[Config('profiles')]
        private array $profiles,
    ) {}

    /**
     * @throws ProfilePolicyRefused
     */
    public function handle(InstallBuiltInProfilesCommand $command): ProfileActivation
    {
        $proposal = ProfileProposal::fromConfiguration($this->profiles)->withBuiltIns();

        return $this->activation->activate($proposal, $command->dispatchedBy());
    }
}
