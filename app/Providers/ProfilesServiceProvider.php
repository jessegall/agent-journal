<?php

declare(strict_types=1);

namespace App\Providers;

use App\Concerns\LoadsCoreRoutes;
use App\Contracts\Accounts\ActiveAccountReader;
use App\Contracts\Accounts\StartAccounts as StartAccountsContract;
use App\Contracts\Actors\CurrentActor;
use App\Contracts\Admission\ReadAdmission as ReadAdmissionContract;
use App\Contracts\Admission\StartProfileAdmission as StartProfileAdmissionContract;
use App\Contracts\Authorization\AuthorizerProviderRegistration;
use App\Contracts\Authorization\CurrentAuthorizer;
use App\Contracts\Authorization\OperationNames as OperationNamesContract;
use App\Contracts\Authorization\OperationPolicy as OperationPolicyContract;
use App\Contracts\Authorization\PolicyCatalogue;
use App\Contracts\Authorization\ReadEntitlements;
use App\Contracts\Bus\CommandAdmission as CommandAdmissionContract;
use App\Contracts\Bus\CommandPermissionResolver as CommandPermissionResolverContract;
use App\Contracts\Scripts\ProfileScripts;
use App\Contracts\Sessions\BuiltInStartProfiles as BuiltInStartProfilesContract;
use App\Contracts\Sessions\ProfileResolver;
use App\Contracts\Sessions\ProfileRules;
use App\Contracts\Sessions\ProfileSelections as ProfileSelectionsContract;
use App\Enums\Accounts\SignInMethod;
use App\Enums\Agents\AccessType;
use App\Models\Accounts\Account;
use App\Models\Accounts\AccountNotice;
use App\Models\Accounts\AccountUsageCost;
use App\Models\Accounts\AccountUsageTokens;
use App\Models\Accounts\AccountUsageWindow;
use App\Models\Accounts\ActiveAccount;
use App\Models\Accounts\SignInAttempt;
use App\Models\Agents\Agent;
use App\Models\Profiles\Profile;
use App\Models\Support\AccountOwnerScope;
use App\Policies\AccountPolicy;
use App\Policies\ProfileAdministrationPolicy;
use App\Policies\ProfileDraftPolicy;
use App\Resolvers\ActiveAccountRecords;
use App\Resolvers\ProfileRecords;
use App\Resolvers\ProfileSelections;
use App\Support\AccountDraftProducer;
use App\Support\AgentImage;
use App\Support\BuiltInAuthorizations;
use App\Support\BuiltInStartProfiles;
use App\Support\ClaudeKeySignIn;
use App\Support\ClaudeSignIn;
use App\Support\ClaudeTokenSignIn;
use App\Support\CodexKeySignIn;
use App\Support\CodexSignIn;
use App\Support\CommandAdmission;
use App\Support\CommandPermissionResolver;
use App\Support\DraftProducers;
use App\Support\OperationNames;
use App\Support\OperationPolicy;
use App\Support\ProfileAuthorizerProvider;
use App\Support\ReadAdmission;
use App\Support\SignInEgress;
use App\Support\SignInProtocols;
use App\Support\StartAccounts;
use App\Support\StartProfileAdmission;
use App\Support\SystemEntryPolicies;
use App\Support\UnreadProfileRules;
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
    use LoadsCoreRoutes;

    public function register(): void
    {
        $this->app->bind(CommandAdmissionContract::class, CommandAdmission::class);
        $this->app->bind(ReadAdmissionContract::class, ReadAdmission::class);
        $this->app->scoped(CommandPermissionResolverContract::class, CommandPermissionResolver::class);
        $this->app->scoped(OperationPolicyContract::class, OperationPolicy::class);
        $this->app->bind(OperationNamesContract::class, OperationNames::class);
        $this->app->bind(ProfileResolver::class, ProfileRecords::class);
        $this->app->bind(ProfileRules::class, UnreadProfileRules::class);
        $this->app->bind(StartAccountsContract::class, StartAccounts::class);
        $this->app->bind(ProfileScripts::class, ProfileRecords::class);
        $this->app->bind(ProfileSelectionsContract::class, ProfileSelections::class);
        $this->app->bind(StartProfileAdmissionContract::class, StartProfileAdmission::class);
        $this->app->bind(BuiltInStartProfilesContract::class, BuiltInStartProfiles::class);
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

        $this->callAfterResolving(
            DraftProducers::class,
            fn (DraftProducers $producers) => $producers->register('account', AccountDraftProducer::class),
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
            [
                AccessType::Create,
                AccessType::Edit,
            ],
        ));

        // A switch's replacement starts as the journal once the old session's stop is proven, on the account the
        // owner chose when they asked for the switch.
        foreach ([
            ProfileAdministrationPolicy::class,
            AccountPolicy::class,
        ] as $policy) {
            $systemEntries->allow('driver switch', $policy);
        }

        $policies->register('Core', new PolicyDefinition(
            ProfileDraftPolicy::class,
            [AccessType::Edit],
        ));

        $policies->register('Core', new PolicyDefinition(
            AccountPolicy::class,
            [
                AccessType::Read,
                AccessType::Create,
                AccessType::Edit,
                AccessType::Delete,
            ],
        ));

        $this->scopeAccountsToOwner($events);

        $this->callAfterResolving(
            Schedule::class,
            fn (Schedule $schedule) => $schedule->command('accounts:reconcile')->everyMinute()->withoutOverlapping(),
        );

        $authorizers->register(Agent::class, ProfileAuthorizerProvider::class);
        $this->loadCoreRoutes('profiles/web.php');
        $this->loadCoreRoutes('profiles/sign-in-host.php');
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
