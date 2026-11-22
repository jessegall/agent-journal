<?php

declare(strict_types=1);

namespace App\Providers;

use App\Contracts\Accounts\ActiveAccountReader;
use App\Contracts\Accounts\StartAccounts;
use App\Contracts\Actors\CurrentActor;
use App\Contracts\Admission\ReadAdmission;
use App\Contracts\Admission\StartProfileAdmission;
use App\Contracts\Authorization\AuthorizerProviderRegistration;
use App\Contracts\Authorization\CurrentAuthorizer;
use App\Contracts\Authorization\OperationNames;
use App\Contracts\Authorization\OperationPolicy;
use App\Contracts\Authorization\PolicyCatalogue;
use App\Contracts\Authorization\ReadEntitlements;
use App\Contracts\Bus\CommandAdmission;
use App\Contracts\Bus\CommandPermissionResolver;
use App\Contracts\Scripts\ProfileScripts;
use App\Contracts\Sessions\BuiltInStartProfiles;
use App\Contracts\Sessions\ProfileResolver;
use App\Contracts\Sessions\ProfileSelections;
use App\Enums\AccessType;
use App\Enums\ActorType;
use App\Enums\SignInMethod;
use App\Models\Account;
use App\Models\AccountNotice;
use App\Models\AccountUsageCost;
use App\Models\AccountUsageTokens;
use App\Models\AccountUsageWindow;
use App\Models\ActiveAccount;
use App\Models\Profile;
use App\Models\SignInAttempt;
use App\Models\Support\AccountOwnerScope;
use App\Policies\AccountPolicy;
use App\Policies\ProfileAdministrationPolicy;
use App\Policies\ProfileDraftPolicy;
use App\Resolvers\ActiveAccountRecords;
use App\Resolvers\ProfileDrivers;
use App\Resolvers\ProfileRecords;
use App\Support\AgentImage;
use App\Support\BuiltInAuthorizations;
use App\Support\BuiltInProfilePins;
use App\Support\ClaudeKeySignIn;
use App\Support\ClaudeSignIn;
use App\Support\ClaudeTokenSignIn;
use App\Support\CodexKeySignIn;
use App\Support\CodexSignIn;
use App\Support\ConfiguredOperations;
use App\Support\EligibleAccounts;
use App\Support\PolicyReadAdmission;
use App\Support\ProfileAuthorizerProvider;
use App\Support\ProfileOperationPolicy;
use App\Support\ProfilePermissionReader;
use App\Support\ProfileStartAdmission;
use App\Support\SignInEgress;
use App\Support\SignInProtocols;
use App\Support\StackCommandAdmission;
use App\Support\SystemEntryPolicies;
use App\Values\PolicyDefinition;
use App\Values\ReadEntitlement;
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
        $this->app->bind(StartAccounts::class, EligibleAccounts::class);
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
        $this->loadRoutesFrom(dirname(__DIR__, 2).'/routes/profiles/web.php');
        $this->loadRoutesFrom(dirname(__DIR__, 2).'/routes/profiles/sign-in-host.php');
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
