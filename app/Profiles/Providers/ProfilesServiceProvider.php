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
use App\Agents\Contracts\BuiltInStartProfiles;
use App\Agents\Contracts\StartProfileAdmission;
use App\Autoload\Support\FolderClasses;
use App\Hooks\Contracts\OperationPolicy;
use App\Processes\Contracts\CommandPermissionResolver;
use App\Profiles\Contracts\OperationNames;
use App\Profiles\Contracts\ProfileResolver;
use App\Profiles\Contracts\ProfileScripts;
use App\Profiles\Contracts\ProfileSelections;
use App\Profiles\Enums\AccountAbility;
use App\Profiles\Enums\ProfileAbility;
use App\Profiles\Models\Account;
use App\Profiles\Models\AccountNotice;
use App\Profiles\Models\ActiveAccount;
use App\Profiles\Models\Profile;
use App\Profiles\Models\SignInAttempt;
use App\Profiles\Models\Support\AccountOwnerScope;
use App\Profiles\Policies\AccountPolicy;
use App\Profiles\Policies\ProfileAdministrationPolicy;
use App\Profiles\Resolvers\ActiveAccountRecords;
use App\Profiles\Resolvers\ProfilePrograms;
use App\Profiles\Resolvers\ProfileRecords;
use App\Profiles\Support\BuiltInProfilePins;
use App\Profiles\Support\ClaudeSignIn;
use App\Profiles\Support\CodexSignIn;
use App\Profiles\Support\ConfiguredOperations;
use App\Profiles\Support\ProfileAuthorizerProvider;
use App\Profiles\Support\ProfileOperationPolicy;
use App\Profiles\Support\ProfilePermissionReader;
use App\Profiles\Support\ProfileStartAdmission;
use App\Profiles\Support\SignInProtocols;
use Illuminate\Console\Command;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Container\Container;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Support\ServiceProvider;

/**
 * Binds Core's profile reader and start selection to the stored profile revisions, loads the main start route and
 * registers the profile console commands. Saved accounts are read only by an actor granted the account read.
 */
final class ProfilesServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->scoped(CommandPermissionResolver::class, ProfilePermissionReader::class);
        $this->app->scoped(OperationPolicy::class, ProfileOperationPolicy::class);
        $this->app->bind(OperationNames::class, ConfiguredOperations::class);
        $this->app->bind(ProfileResolver::class, ProfileRecords::class);
        $this->app->bind(ProfileScripts::class, ProfileRecords::class);
        $this->app->bind(ProfileSelections::class, ProfilePrograms::class);
        $this->app->bind(StartProfileAdmission::class, ProfileStartAdmission::class);
        $this->app->bind(BuiltInStartProfiles::class, BuiltInProfilePins::class);
        $this->app->bind(ActiveAccountReader::class, ActiveAccountRecords::class);
        $this->app->singleton(SignInProtocols::class);
        $this->callAfterResolving(
            SignInProtocols::class,
            function (SignInProtocols $protocols): void {
                $protocols->register('claude-code', ClaudeSignIn::class);
                $protocols->register('codex', CodexSignIn::class);
            },
        );
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
        $this->scopeAccountsToOwner($events);
        $this->callAfterResolving(
            Schedule::class,
            fn (Schedule $schedule) => $schedule->command('accounts:reconcile')->everyMinute()->withoutOverlapping(),
        );
        $authorizers->register(ActorType::Agent, ProfileAuthorizerProvider::class);
        $this->loadRoutesFrom(dirname(__DIR__).'/Routes/web.php');
        $this->loadRoutesFrom(dirname(__DIR__).'/Routes/sign-in-host.php');

        if ($this->app->runningInConsole()) {
            $this->commands(FolderClasses::in(dirname(__DIR__).'/Console', Command::class));
        }
    }

    /**
     * Every account query asks, when it runs, whether the actor of that request may read accounts.
     */
    private function scopeAccountsToOwner(Dispatcher $events): void
    {
        $scope = new AccountOwnerScope(
            static fn () => Container::getInstance()->make(CurrentActor::class),
            static fn () => Container::getInstance()->make(CurrentAuthorizer::class),
        );

        foreach ([Account::class, ActiveAccount::class, SignInAttempt::class, AccountNotice::class] as $model) {
            $events->listen("eloquent.booted: {$model}", fn () => $model::addGlobalScope($scope));
        }
    }
}
