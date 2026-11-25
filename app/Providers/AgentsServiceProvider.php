<?php

declare(strict_types=1);

namespace App\Providers;

use App\Concerns\LoadsCoreRoutes;
use App\Contracts\Accounts\AccountUses;
use App\Contracts\Accounts\ActiveAccountReader;
use App\Contracts\Activity\ActivityLog;
use App\Contracts\Actors\ActorAttention;
use App\Contracts\Actors\ActorProviderRegistration;
use App\Contracts\Actors\CurrentActor;
use App\Contracts\Admission\MergeAdmission;
use App\Contracts\Assignments\AssignmentRegistration;
use App\Contracts\Authorization\AgentAuthority;
use App\Contracts\Authorization\AuthorizerProviderRegistration;
use App\Contracts\Authorization\PolicyCatalogue;
use App\Contracts\Authorization\ReadGrant as ReadGrantContract;
use App\Contracts\Domains\CallRegistrar;
use App\Contracts\Domains\CallSender;
use App\Contracts\Drivers\AttachmentReferences;
use App\Contracts\Drivers\CallingDriver;
use App\Contracts\Drivers\DriverCatalogue;
use App\Contracts\Drivers\DriverConversationResolver;
use App\Contracts\Drivers\ToolDiscovery;
use App\Contracts\Files\Files;
use App\Contracts\Files\WorkspaceReader;
use App\Contracts\Hosts\DockerImageVerifier as DockerImageVerifierContract;
use App\Contracts\Hosts\HostCalls;
use App\Contracts\Hosts\HostCapabilities;
use App\Contracts\Navigation\NavigationExpiry as NavigationExpiryContract;
use App\Contracts\Navigation\NavigationReader;
use App\Contracts\Navigation\TerminalViewCloser;
use App\Contracts\Processes\RuntimeStops;
use App\Contracts\Reads\SessionOutputAccess;
use App\Contracts\Sessions\AgentCallContext;
use App\Contracts\Sessions\AgentDirectory;
use App\Contracts\Sessions\AgentRequestClient as AgentRequestClientContract;
use App\Contracts\Sessions\AgentResolver;
use App\Contracts\Sessions\CurrentSession;
use App\Contracts\Sessions\LaunchCandidates;
use App\Contracts\Sessions\RuntimeResolver;
use App\Contracts\Sessions\SessionPolicyReader;
use App\Contracts\Sessions\SessionProvenance as SessionProvenanceContract;
use App\Contracts\Sessions\SessionRequestResolver;
use App\Contracts\Sessions\SessionResolver;
use App\Contracts\Sessions\SessionTokenSource;
use App\Contracts\Sessions\StartExecutor;
use App\Contracts\Sessions\StartHeartbeats as StartHeartbeatsContract;
use App\Contracts\Sessions\StartPreflight;
use App\Contracts\Sessions\StartReceipts;
use App\Contracts\Sessions\StartReservations;
use App\Contracts\Sessions\StartTransaction;
use App\Contracts\Settings\SettingsResolver;
use App\Contracts\Work\HelperCommitImport as HelperCommitImportContract;
use App\Enums\Agents\AccessType;
use App\Enums\Assignments\ActorType;
use App\Enums\Assignments\AssignmentPurpose;
use App\Enums\Files\Place;
use App\Exceptions\AgentContextMissing;
use App\Models\Agents\Agent;
use App\Models\Drivers\NavigationRequest;
use App\Models\Sessions\SessionProcess;
use App\Models\Support\SessionProcessScope;
use App\Policies\ActivityPolicy;
use App\Policies\AgentMaintenancePolicy;
use App\Policies\AgentPolicy;
use App\Policies\AgentTerminalControlPolicy;
use App\Resolvers\AgentAuthorityRecords;
use App\Resolvers\AgentLabels;
use App\Resolvers\AgentLaunchCandidates;
use App\Resolvers\AgentRecords;
use App\Resolvers\CallingSessionDriver;
use App\Resolvers\DriverConversationRecords;
use App\Resolvers\LinkedAccountUses;
use App\Resolvers\OwnerStartReceipts;
use App\Resolvers\RecordedHostCapabilities;
use App\Resolvers\RuntimeRecords;
use App\Resolvers\SessionRecords;
use App\Resolvers\SessionRequests;
use App\Resolvers\Support\CurrentAgentRuntimes;
use App\Resolvers\Support\PendingStartSecrets;
use App\Resolvers\UnconfiguredAccounts;
use App\Support\ActiveActorCounterRegistry;
use App\Support\ActivityDefinition;
use App\Support\ActivityRetentionService;
use App\Support\AgentActivity;
use App\Support\AgentActors;
use App\Support\AgentAssignees;
use App\Support\AgentClientSettings;
use App\Support\AgentContext;
use App\Support\AgentNavigationRecords;
use App\Support\AgentRequestClient;
use App\Support\AgentSessionCounter;
use App\Support\AgentVisibility;
use App\Support\ArrangementSetting;
use App\Support\AssigneeDefinition;
use App\Support\CallRoutes;
use App\Support\CoreSettings;
use App\Support\CurrentRuntimeAttention;
use App\Support\DatabaseStartTransaction;
use App\Support\DockerImageVerifier;
use App\Support\DriverBudgets;
use App\Support\DriverRuntimeStops;
use App\Support\EnvironmentCredentialSource;
use App\Support\FrozenSessionPolicies;
use App\Support\GrantedSessionOutputs;
use App\Support\HeartbeatService;
use App\Support\HelperCommitImport;
use App\Support\HostStartExecutor;
use App\Support\HostStartPreflight;
use App\Support\InstallLineAvailability;
use App\Support\LaunchProfiles;
use App\Support\NavigationExpiry;
use App\Support\NavigationRequestProvider;
use App\Support\PendingNavigationWork;
use App\Support\PendingWorkSources;
use App\Support\ProtectedMerge;
use App\Support\PublishedReleases;
use App\Support\ReadGrant;
use App\Support\ReadinessCheckSweep;
use App\Support\RequestSession;
use App\Support\ReserveStarts;
use App\Support\RetainedWorkspaceReads;
use App\Support\ServedActivityLog;
use App\Support\ServerOrigin;
use App\Support\SessionProvenance;
use App\Support\SessionToolDiscovery;
use App\Support\SignedCallSender;
use App\Support\SignedHostCalls;
use App\Support\StartEnvironment;
use App\Support\SystemEntryPolicies;
use App\Support\TerminalViews;
use App\Support\UnavailableAttachments;
use App\Support\UnavailableMergeAdmission;
use App\Values\FilePath;
use App\Values\HostCapacity;
use App\Values\PolicyDefinition;
use Carbon\CarbonImmutable;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Container\Container;
use Illuminate\Contracts\Config\Repository;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Process\Factory;
use Illuminate\Support\ServiceProvider;
use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;

/**
 * Gives each request its own agent context, which only the agent middleware fills; without it, asking for one fails.
 * A start runs in a plain transaction until another domain supplies a bounded one. Agents are registered as holders
 * of
 * assigned work, and their present sessions are counted for ActiveActorsResolver.
 */
final class AgentsServiceProvider extends ServiceProvider
{
    use LoadsCoreRoutes;

    private const string OWNER = 'Agents';

    public function register(): void
    {
        $this->app->bind(ReadGrantContract::class, ReadGrant::class);
        $this->app->bind(AgentResolver::class, AgentLabels::class);
        $this->app->bind(ActivityLog::class, ServedActivityLog::class);

        $this->app->scoped(RequestSession::class, static fn (Container $app) => new RequestSession(
            static fn (): Option => $app->resolved(AgentContext::class)
                ? new Some($app->make(AgentContext::class))
                : None::create(),
            static function (Option $context) use ($app): void {
                if ($context->isEmpty()) {
                    $app->forgetInstance(AgentContext::class);

                    return;
                }

                $app->instance(AgentContext::class, $context->get());
            },
        ));

        $this->app->alias(RequestSession::class, CurrentSession::class);
        $this->app->alias(RequestSession::class, AgentCallContext::class);
        $this->app->bind(ToolDiscovery::class, SessionToolDiscovery::class);
        $this->app->bind(WorkspaceReader::class, RetainedWorkspaceReads::class);
        $this->app->bindIf(MergeAdmission::class, UnavailableMergeAdmission::class);
        $this->app->bindIf(AttachmentReferences::class, UnavailableAttachments::class);
        $this->app->bind(RuntimeStops::class, DriverRuntimeStops::class);
        $this->app->bind(NavigationReader::class, AgentNavigationRecords::class);
        $this->app->bind(TerminalViewCloser::class, TerminalViews::class);

        $this->app->bind(StartExecutor::class, fn () => new HostStartExecutor(
            $this->app->make(Repository::class)->string('agents.host_start_socket'),
            $this->app->make(DriverCatalogue::class),
        ));

        $this->app->bind(RuntimeResolver::class, RuntimeRecords::class);
        $this->app->bind(SessionResolver::class, SessionRecords::class);
        $this->app->bind(AgentDirectory::class, AgentRecords::class);
        $this->app->bind(AgentRequestClientContract::class, AgentRequestClient::class);
        $this->app->bind(StartHeartbeatsContract::class, HeartbeatService::class);
        $this->app->bind(NavigationExpiryContract::class, NavigationExpiry::class);
        $this->app->scoped(CurrentAgentRuntimes::class);
        $this->app->scoped(ActorAttention::class, CurrentRuntimeAttention::class);
        $this->app->scoped(AgentContext::class, AgentContextMissing::throwing()->forRequest());
        $this->app->scoped(AgentAssignees::class);
        $this->app->bind(AgentAuthority::class, AgentAuthorityRecords::class);
        $this->app->bind(CallSender::class, SignedCallSender::class);
        $this->app->bind(CallRegistrar::class, CallRoutes::class);
        $this->app->bind(SessionRequestResolver::class, SessionRequests::class);
        $this->app->bind(DriverConversationResolver::class, DriverConversationRecords::class);

        $this->app->bind(
            DockerImageVerifierContract::class,
            fn () => new DockerImageVerifier(
                $this->app->make(Files::class),
                FilePath::in(Place::Project, 'docs/accounts/docker-images.json'),
            ),
        );

        $this->app->bind(SessionPolicyReader::class, FrozenSessionPolicies::class);
        $this->app->bind(SessionProvenanceContract::class, SessionProvenance::class);
        $this->app->bind(LaunchCandidates::class, AgentLaunchCandidates::class);
        $this->app->bind(StartReservations::class, ReserveStarts::class);
        $this->app->bind(StartReceipts::class, OwnerStartReceipts::class);
        $this->app->bind(CallingDriver::class, CallingSessionDriver::class);

        $this->app->singleton(DriverBudgets::class, fn () => new DriverBudgets(
            $this->app->make('config')->integer('agents.driver_budgets.claim_batch_max'),
            $this->app->make('config')->integer('agents.driver_budgets.long_poll_max_seconds'),
            $this->app->make('config')->integer('agents.driver_budgets.deliver_max_bytes'),
        ));

        $this->app->singleton(ArrangementSetting::class, fn () => ArrangementSetting::fromConfig(
            $this->app->make('config')->string('agents.arrangement'),
            $this->app->make('config')->string('agents.installation_name'),
            $this->app->make('config')->string('agents.workspaces'),
        ));

        $this->app->singleton(PublishedReleases::class, fn () => new PublishedReleases(
            $this->app->make(Files::class),
            $this->app->make('config')->string('agents.release'),
        ));

        $this->app->bind(InstallLineAvailability::class, fn () => new InstallLineAvailability(
            $this->app->make(SettingsResolver::class),
            $this->app->make(CoreSettings::class),
            $this->app->make(PublishedReleases::class),
            $this->app->make(ServerOrigin::class),
        ));

        $this->app->bind(HostCalls::class, SignedHostCalls::class);

        $this->app->singleton(ServerOrigin::class, fn () => new ServerOrigin(
            $this->app->make('config')->string('agents.server_origin'),
            $this->app->isLocal(),
        ));

        $this->app->bind(LaunchProfiles::class, fn () => new LaunchProfiles(
            $this->app->make(ArrangementSetting::class),
            $this->app->make(HostCapabilities::class),
            LaunchProfiles::trialOf($this->app->make('config')->string('agents.protected_account_trial')),
        ));

        $this->app->singleton(HostCapacity::class, fn () => new HostCapacity(
            $this->app->make('config')->integer('agents.host_capacity.cpu_cores'),
            $this->app->make('config')->integer('agents.host_capacity.memory_bytes'),
            $this->app->make('config')->integer('agents.host_capacity.disk_bytes'),
            $this->app->make('config')->boolean('agents.host_capacity.guarded'),
        ));

        $this->app->scoped(PendingStartSecrets::class);

        $this->app->bind(
            HelperCommitImport::class,
            fn () => new HelperCommitImport($this->app->make(Factory::class), base_path()),
        );

        $this->app->alias(HelperCommitImport::class, HelperCommitImportContract::class);

        $this->app->bind(
            ProtectedMerge::class,
            fn () => new ProtectedMerge($this->app->make(Factory::class), base_path()),
        );

        $this->app->bind(
            HostCapabilities::class,
            fn () => new RecordedHostCapabilities(
                $this->app->make(Files::class),
                FilePath::in(Place::Project, 'docs/accounts/container-capabilities.json'),
            ),
        );

        $this->app->bindIf(StartTransaction::class, DatabaseStartTransaction::class);
        $this->app->bind(StartEnvironment::class, StartEnvironment::ofThisProcess(...));
        $this->app->bind(SessionTokenSource::class, EnvironmentCredentialSource::class);
        $this->app->bindIf(ActiveAccountReader::class, UnconfiguredAccounts::class);
        $this->app->bind(StartPreflight::class, HostStartPreflight::class);
        $this->app->bind(AccountUses::class, LinkedAccountUses::class);
        $this->app->bind(SessionOutputAccess::class, GrantedSessionOutputs::class);

        $this->app->bind(
            AgentClientSettings::class,
            fn ($app) => $app->make(SessionTokenSource::class)->forThisStart(),
        );

        $this->app->singleton(PendingWorkSources::class);
    }

    public function boot(
        SystemEntryPolicies $systemEntries,
        AssignmentRegistration $assignments,
        ActorProviderRegistration $actors,
        ActiveActorCounterRegistry $presentActors,
        AuthorizerProviderRegistration $authorizers,
        PolicyCatalogue $policies,
        PendingWorkSources $pendingWork,
        Dispatcher $events,
        // read at boot so an unknown AGENTS_ARRANGEMENT stops the journal at once, naming the value
        ArrangementSetting $arrangement,
    ): void {
        $this->callAfterResolving(
            Schedule::class,
            fn (Schedule $schedule) => $schedule
                ->call(fn (ReadinessCheckSweep $sweep) => $sweep->sweep(CarbonImmutable::now()))
                ->everyMinute(),
        );

        $this->callAfterResolving(
            Schedule::class,
            fn (Schedule $schedule) => $schedule
                ->call(fn (ActivityRetentionService $pruning) => $pruning->prune())
                ->hourly(),
        );

        $starts = new SessionProcessScope(static fn () => Container::getInstance()->make(CurrentActor::class));
        $events->listen('eloquent.booted: '.SessionProcess::class, fn () => SessionProcess::addGlobalScope($starts));

        $policies->register('Core', new PolicyDefinition(ActivityPolicy::class, [AccessType::Read]));

        $policies->register('Core', new PolicyDefinition(
            AgentPolicy::class,
            [
                AccessType::Read,
                AccessType::Create,
                AccessType::Edit,
                AccessType::Delete,
                AccessType::Admin,
            ],
        ));

        $policies->register('Core', new PolicyDefinition(
            AgentMaintenancePolicy::class,
            [
                AccessType::Read,
                AccessType::Create,
                AccessType::Edit,
                AccessType::Execute,
            ],
        ));

        $policies->register('Core', new PolicyDefinition(AgentTerminalControlPolicy::class, [AccessType::Edit]));

        $systemEntries->allow('account reconciliation', AgentMaintenancePolicy::class);
        $systemEntries->allow('main agent install', AgentPolicy::class);
        $systemEntries->allow('driver switch', AgentPolicy::class);
        $actors->register(ActorType::Agent, AgentActors::class);
        $actors->registerLabels(ActorType::Agent, AgentLabels::class);
        $actors->registerVisibility(ActorType::Agent, AgentVisibility::class);
        $this->loadCoreRoutes('agents/agents.php');
        $this->loadCoreRoutes('agents/host.php');
        $this->loadCoreRoutes('agents/releases.php');

        $assignments->registerAssignees(new AssigneeDefinition(ActorType::Agent->value, AgentAssignees::class));

        $assignments->registerOwner(self::OWNER, []);

        $assignments->registerRecord(
            NavigationRequest::linkType(),
            NavigationRequestProvider::class,
            self::OWNER,
            AssignmentPurpose::InternalResponsibility,
        );

        $pendingWork->register(PendingNavigationWork::class);
        $assignments->registerActivity(new ActivityDefinition(ActorType::Agent, AgentActivity::class));
        $presentActors->register(AgentSessionCounter::class);
    }
}
