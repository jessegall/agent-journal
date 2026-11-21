<?php

declare(strict_types=1);

namespace App\Profiles\Providers;

use App\Actors\Contracts\AuthorizerProviderRegistration;
use App\Actors\Contracts\CurrentActor;
use App\Actors\Contracts\CurrentAuthorizer;
use App\Actors\Contracts\PolicyCatalogue;
use App\Actors\Contracts\ReadEntitlements;
use App\Actors\Enums\ActorType;
use App\Actors\Support\SystemEntryPolicies;
use App\Actors\Values\PolicyDefinition;
use App\Actors\Values\ReadEntitlement;
use App\Agents\Contracts\ActiveAccountReader;
use App\Agents\Contracts\BuiltInStartProfiles;
use App\Agents\Contracts\ReadAdmission;
use App\Agents\Contracts\StartProfileAdmission;
use App\Autoload\Support\FolderClasses;
use App\Bus\Contracts\CommandAdmission;
use App\Hooks\Contracts\OperationPolicy;
use App\Operations\Enums\AccessType;
use App\Processes\Contracts\CommandPermissionResolver;
use App\Profiles\Contracts\OperationNames;
use App\Profiles\Contracts\ProfileResolver;
use App\Profiles\Contracts\ProfileScripts;
use App\Profiles\Contracts\ProfileSelections;
use App\Profiles\Enums\SignInMethod;
use App\Profiles\Models\Account;
use App\Profiles\Models\AccountNotice;
use App\Profiles\Models\AccountUsageCost;
use App\Profiles\Models\AccountUsageTokens;
use App\Profiles\Models\AccountUsageWindow;
use App\Profiles\Models\ActiveAccount;
use App\Profiles\Models\Profile;
use App\Profiles\Models\SignInAttempt;
use App\Profiles\Models\Support\AccountOwnerScope;
use App\Profiles\Policies\AccountPolicy;
use App\Profiles\Policies\ProfileAdministrationPolicy;
use App\Profiles\Policies\ProfileDraftPolicy;
use App\Profiles\Resolvers\ActiveAccountRecords;
use App\Profiles\Resolvers\ProfileDrivers;
use App\Profiles\Resolvers\ProfileRecords;
use App\Profiles\Support\AgentImage;
use App\Profiles\Support\BuiltInAuthorizations;
use App\Profiles\Support\BuiltInProfilePins;
use App\Profiles\Support\ClaudeKeySignIn;
use App\Profiles\Support\ClaudeSignIn;
use App\Profiles\Support\ClaudeTokenSignIn;
use App\Profiles\Support\CodexKeySignIn;
use App\Profiles\Support\CodexSignIn;
use App\Profiles\Support\ConfiguredOperations;
use App\Profiles\Support\PolicyReadAdmission;
use App\Profiles\Support\ProfileAuthorizerProvider;
use App\Profiles\Support\ProfileOperationPolicy;
use App\Profiles\Support\ProfilePermissionReader;
use App\Profiles\Support\ProfileStartAdmission;
use App\Profiles\Support\SignInEgress;
use App\Profiles\Support\SignInProtocols;
use App\Profiles\Support\StackCommandAdmission;
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
        $this->app->bind(CommandAdmission::class, StackCommandAdmission::class);
        $this->app->bind(ReadAdmission::class, PolicyReadAdmission::class);
        $this->app->scoped(CommandPermissionResolver::class, ProfilePermissionReader::class);
        $this->app->scoped(OperationPolicy::class, ProfileOperationPolicy::class);
        $this->app->bind(OperationNames::class, ConfiguredOperations::class);
        $this->app->bind(ProfileResolver::class, ProfileRecords::class);
        $this->app->bind(ProfileScripts::class, ProfileRecords::class);
        $this->app->bind(ProfileSelections::class, ProfileDrivers::class);
        $this->app->bind(StartProfileAdmission::class, ProfileStartAdmission::class);
        $this->app->bind(BuiltInStartProfiles::class, BuiltInProfilePins::class);
        $this->app->bind(ActiveAccountReader::class, ActiveAccountRecords::class);
        $this->app->singleton(SignInProtocols::class);

        $this->app->singleton(AgentImage::class, fn () => AgentImage::fromConfig(
            $this->app->make('config')->string('agents.agent_image'),
        ));

        $this->app->singleton(SignInEgress::class, fn () => new SignInEgress(
            $this->app->make('config')->string('accounts.egress_proxy'),
        ));

        $this->callAfterResolving(
            SignInProtocols::class,
            function (SignInProtocols $protocols): void {
                $protocols->register('claude-code', SignInMethod::OAuth, ClaudeSignIn::class);
                $protocols->register('claude-code', SignInMethod::ProviderToken, ClaudeTokenSignIn::class);
                $protocols->register('claude-code', SignInMethod::ApiKey, ClaudeKeySignIn::class);
                $protocols->register('codex', SignInMethod::OAuth, CodexSignIn::class);
                $protocols->register('codex', SignInMethod::ApiKey, CodexKeySignIn::class);
            },
        );
    }

    public function boot(
        AuthorizerProviderRegistration $authorizers,
        PolicyCatalogue $policies,
        Dispatcher $events,
        ReadEntitlements $reads,
        SystemEntryPolicies $systemEntries,
    ): void {
        foreach (BuiltInAuthorizations::ORIENTATION_READS as $read) {
            $reads->declare($read, ReadEntitlement::named());
        }

        $policies->register('Core', new PolicyDefinition(
            ProfileAdministrationPolicy::class,
            [AccessType::Create, AccessType::Edit],
        ));

        // A switch's replacement starts as the journal once the old session's stop is proven, on the account the
        // owner chose when they asked for the switch.
        foreach ([ProfileAdministrationPolicy::class, AccountPolicy::class] as $policy) {
            $systemEntries->allow('driver switch', $policy);
        }

        $policies->register('Core', new PolicyDefinition(
            ProfileDraftPolicy::class,
            [AccessType::Edit],
        ));

        $policies->register('Core', new PolicyDefinition(
            AccountPolicy::class,
            [AccessType::Read, AccessType::Create, AccessType::Edit, AccessType::Delete],
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

        $models = [
            Account::class,
            ActiveAccount::class,
            SignInAttempt::class,
            AccountNotice::class,
            AccountUsageWindow::class,
            AccountUsageCost::class,
            AccountUsageTokens::class,
        ];

        foreach ($models as $model) {
            $events->listen("eloquent.booted: {$model}", fn () => $model::addGlobalScope($scope));
        }
    }
}
