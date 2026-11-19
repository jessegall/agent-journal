<?php

declare(strict_types=1);

namespace App\Profiles\Providers;

use App\Actors\Contracts\AuthorizerProviderRegistration;
use App\Actors\Contracts\CurrentActor;
use App\Actors\Contracts\CurrentAuthorizer;
use App\Actors\Contracts\PolicyCatalogue;
use App\Actors\Enums\ActorType;
use App\Actors\Values\PolicyRegistration;
use App\Agents\Contracts\ActiveAccountReader;
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
use App\Profiles\Enums\AccountAbility;
use App\Profiles\Enums\ProfileAbility;
use App\Profiles\Models\Account;
use App\Profiles\Models\ActiveAccount;
use App\Profiles\Models\Profile;
use App\Profiles\Models\SignInAttempt;
use App\Profiles\Models\Support\HumanAccounts;
use App\Profiles\Policies\AccountPolicy;
use App\Profiles\Policies\ProfileAdministrationPolicy;
use App\Profiles\Resolvers\ActiveAccountRecords;
use App\Profiles\Resolvers\ProfilePrograms;
use App\Profiles\Resolvers\ProfileRecords;
use App\Profiles\Support\BuiltInProfilePins;
use App\Profiles\Support\ConfiguredOperations;
use App\Profiles\Support\ProfileAuthorizerProvider;
use App\Profiles\Support\ProfileFileEditPermission;
use App\Profiles\Support\ProfileLaunchAdmission;
use App\Profiles\Support\ProfilePermissionReader;
use Illuminate\Container\Container;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Support\ServiceProvider;

/**
 * Binds Core's profile reader and launch selection to the stored profile revisions, loads the main launch route and
 * registers the profile console commands. Saved accounts are read only by an actor granted the account read.
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
        $this->app->bind(ActiveAccountReader::class, ActiveAccountRecords::class);
    }

    public function boot(
        AuthorizerProviderRegistration $authorizers,
        PolicyCatalogue $policies,
        Dispatcher $events,
    ): void {
        $policies->register('Core', new PolicyRegistration(
            Profile::class,
            ProfileAdministrationPolicy::class,
            ProfileAbility::class,
            ownerOnly: [ProfileAbility::Administer],
        ));
        $policies->register('Core', new PolicyRegistration(
            Account::class,
            AccountPolicy::class,
            AccountAbility::class,
            ownerOnly: [AccountAbility::Read, AccountAbility::Manage],
        ));
        $this->scopeAccountsToTheirOwner($events);
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

    /**
     * Every account query asks, when it runs, whether the actor of that request may read accounts.
     */
    private function scopeAccountsToTheirOwner(Dispatcher $events): void
    {
        $scope = new HumanAccounts(
            static fn () => Container::getInstance()->make(CurrentActor::class),
            static fn () => Container::getInstance()->make(CurrentAuthorizer::class),
        );

        foreach ([Account::class, ActiveAccount::class, SignInAttempt::class] as $model) {
            $events->listen("eloquent.booted: {$model}", fn () => $model::addGlobalScope($scope));
        }
    }
}
