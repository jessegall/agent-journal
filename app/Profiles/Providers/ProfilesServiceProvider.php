<?php

declare(strict_types=1);

namespace App\Profiles\Providers;

use App\Actors\Contracts\AuthorizerProviderRegistration;
use App\Actors\Contracts\PolicyCatalogue;
use App\Actors\Enums\ActorType;
use App\Actors\Values\PolicyRegistration;
use App\Agents\Contracts\BuiltInLaunchProfiles;
use App\Agents\Contracts\LaunchProfileAdmission;
use App\Hooks\Contracts\FileEditPermission;
use App\Processes\Contracts\CommandPermissionResolver;
use App\Profiles\Console\ProfileActivateCommand;
use App\Profiles\Console\ProfileListCommand;
use App\Profiles\Console\ProfileRevokeCommand;
use App\Profiles\Console\ProfileShowCommand;
use App\Profiles\Contracts\KnownOperations;
use App\Profiles\Contracts\ProfileResolver;
use App\Profiles\Contracts\ProfileSelections;
use App\Profiles\Enums\ProfileAbility;
use App\Profiles\Models\Profile;
use App\Profiles\Policies\ProfileAdministrationPolicy;
use App\Profiles\Resolvers\ProfilePrograms;
use App\Profiles\Resolvers\ProfileRecords;
use App\Profiles\Support\BuiltInProfilePins;
use App\Profiles\Support\ConfiguredOperations;
use App\Profiles\Support\ProfileAuthorizerProvider;
use App\Profiles\Support\ProfileFileEditPermission;
use App\Profiles\Support\ProfileLaunchAdmission;
use App\Profiles\Support\ProfilePermissionReader;
use Illuminate\Support\ServiceProvider;

/**
 * Binds Core's profile reader and launch selection to the stored profile revisions, loads the main launch route and
 * registers the profile console commands.
 */
final class ProfilesServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->scoped(CommandPermissionResolver::class, ProfilePermissionReader::class);
        $this->app->scoped(FileEditPermission::class, ProfileFileEditPermission::class);
        $this->app->bind(ProfileResolver::class, ProfileRecords::class);
        $this->app->bind(KnownOperations::class, ConfiguredOperations::class);
        $this->app->bind(ProfileSelections::class, ProfilePrograms::class);
        $this->app->bind(LaunchProfileAdmission::class, ProfileLaunchAdmission::class);
        $this->app->bind(BuiltInLaunchProfiles::class, BuiltInProfilePins::class);
    }

    public function boot(AuthorizerProviderRegistration $authorizers, PolicyCatalogue $policies): void
    {
        $policies->register('Core', new PolicyRegistration(
            Profile::class,
            ProfileAdministrationPolicy::class,
            ProfileAbility::class,
            ownerOnly: [ProfileAbility::Administer],
        ));
        $authorizers->register(ActorType::Agent, ProfileAuthorizerProvider::class);
        $this->loadRoutesFrom(dirname(__DIR__).'/Routes/web.php');

        if ($this->app->runningInConsole()) {
            $this->commands([
                ProfileListCommand::class,
                ProfileShowCommand::class,
                ProfileActivateCommand::class,
                ProfileRevokeCommand::class,
            ]);
        }
    }
}
