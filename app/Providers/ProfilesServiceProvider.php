<?php

declare(strict_types=1);

namespace App\Providers;

use App\Access\CommandAdmissions;
use App\Access\Contracts\AuthorizerProviderRegistration;
use App\Access\Contracts\CurrentAuthorizer;
use App\Access\Contracts\OperationNames as OperationNamesContract;
use App\Access\Contracts\OperationPolicy as OperationPolicyContract;
use App\Access\Contracts\PolicyCatalogue;
use App\Access\Contracts\ReadAdmission as ReadAdmissionContract;
use App\Access\Contracts\ReadEntitlements;
use App\Access\Contracts\StartProfileAdmission as StartProfileAdmissionContract;
use App\Access\ReadAdmission;
use App\Access\SystemEntryPolicies;
use App\Access\Values\PolicyDefinition;
use App\Access\Values\ReadEntitlement;
use App\Accounts\AccountDraftProducer;
use App\Accounts\Contracts\ActiveAccountReader;
use App\Accounts\Contracts\StartAccounts as StartAccountsContract;
use App\Accounts\SignInProtocols;
use App\Accounts\StartAccounts;
use App\Actors\Contracts\CurrentActor;
use App\Agents\Drivers\Processes\AgentImageProbes;
use App\Agents\Enums\AccessType;
use App\Agents\SignInEgress;
use App\Bus\Contracts\CommandAdmission as CommandAdmissionContract;
use App\Bus\Contracts\CommandPermissionResolver as CommandPermissionResolverContract;
use App\Concerns\LoadsCoreRoutes;
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
use App\Profiles\BuiltInAuthorizations;
use App\Profiles\BuiltInStartProfiles;
use App\Profiles\CommandPermissionResolver;
use App\Profiles\OperationNames;
use App\Profiles\OperationPolicy;
use App\Profiles\ProfileAuthorizerProvider;
use App\Profiles\StartProfileAdmission;
use App\Profiles\UnreadProfileRules;
use App\Resolvers\ActiveAccountRecords;
use App\Resolvers\ProfileRecords;
use App\Resolvers\ProfileSelections;
use App\Scripts\Contracts\ProfileScripts;
use App\Sessions\Contracts\BuiltInStartProfiles as BuiltInStartProfilesContract;
use App\Sessions\Contracts\ProfileResolver;
use App\Sessions\Contracts\ProfileRules;
use App\Sessions\Contracts\ProfileSelections as ProfileSelectionsContract;
use App\Support\AgentImage;
use App\Support\DraftProducers;
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
        $this->app->bind(CommandAdmissionContract::class, CommandAdmissions::class);
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
        $this->app->scoped(SignInProtocols::class);

        $this->app->singleton(AgentImage::class, fn () => AgentImage::fromConfig(
            $this->app->make('config')->string('journal.agents.agent_image'),
        ));

        $this->app->bind(AgentImageProbes::class, fn () => new AgentImageProbes(
            $this->app->make('config')->string('journal.agents.security_profiles'),
        ));

        $this->app->singleton(SignInEgress::class, fn () => new SignInEgress(
            $this->app->make('config')->string('journal.accounts.egress_proxy'),
        ));

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
            [AccessType::Create, AccessType::Edit],
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
            [AccessType::Read, AccessType::Create, AccessType::Edit, AccessType::Delete],
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
