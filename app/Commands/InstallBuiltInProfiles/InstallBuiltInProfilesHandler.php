<?php

declare(strict_types=1);

namespace App\Commands\InstallBuiltInProfiles;

use App\Commands\ActivateProfiles\ActivateProfilesHandler;
use App\Contracts\Bus\CommandHandler;
use App\Exceptions\ProfilePolicyRefused;
use App\Support\ProfileProposal;
use App\Values\ProfileActivation;
use Illuminate\Contracts\Config\Repository;

/**
 * Activates the built-in profiles with the project's proposal the same way an owner's activation does; an unchanged
 * definition adds no revision.
 */
final readonly class InstallBuiltInProfilesHandler implements CommandHandler
{
    public function __construct(private ActivateProfilesHandler $activation, private Repository $config) {}

    /**
     * @throws ProfilePolicyRefused
     */
    public function handle(InstallBuiltInProfilesCommand $command): ProfileActivation
    {
        $proposal = ProfileProposal::fromConfiguration((array) $this->config->get('profiles', []))->withBuiltIns();

        return $this->activation->activate($proposal, $command->dispatchedBy());
    }
}
