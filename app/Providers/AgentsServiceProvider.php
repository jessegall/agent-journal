<?php

declare(strict_types=1);

namespace App\Providers;

use App\Concerns\LoadsCoreRoutes;
use App\Contracts\Accounts\AccountUses as AccountUsesContract;
use App\Contracts\Accounts\ActiveAccountReader;
use App\Contracts\Activity\ActivityLog as ActivityLogContract;
use App\Contracts\Actors\ActorAttention as ActorAttentionContract;
use App\Contracts\Actors\ActorProviderRegistration;
use App\Contracts\Actors\CurrentActor;
use App\Contracts\Assignments\AssignmentRegistration;
use App\Contracts\Authorization\AgentAuthority as AgentAuthorityContract;
use App\Contracts\Authorization\AuthorizerProviderRegistration;
use App\Contracts\Authorization\PolicyCatalogue;
use App\Contracts\Authorization\ReadGrant as ReadGrantContract;
use App\Contracts\Domains\ApiRegistrar as ApiRegistrarContract;
use App\Contracts\Domains\ApiSender as ApiSenderContract;
use App\Contracts\Drivers\AttachmentReferences;
use App\Contracts\Drivers\CallingDriver as CallingDriverContract;
use App\Contracts\Drivers\DriverCatalogue;
use App\Contracts\Drivers\DriverConversationResolver as DriverConversationResolverContract;
use App\Contracts\Drivers\ToolDiscovery as ToolDiscoveryContract;
use App\Contracts\Files\Files;
use App\Contracts\Files\WorkspaceReader as WorkspaceReaderContract;
use App\Contracts\Hosts\DockerImageVerifier as DockerImageVerifierContract;
use App\Contracts\Hosts\HostCalls as HostCallsContract;
use App\Contracts\Hosts\HostCapabilities as HostCapabilitiesContract;
use App\Contracts\Inboxes\InboxParticipationEnding;
use App\Contracts\Navigation\NavigationExpiry as NavigationExpiryContract;
use App\Contracts\Navigation\NavigationReader as NavigationReaderContract;
use App\Contracts\Navigation\TerminalViewCloser as TerminalViewCloserContract;
use App\Contracts\Processes\RuntimeStops as RuntimeStopsContract;
use App\Contracts\Reads\SessionOutputAccess as SessionOutputAccessContract;
use App\Contracts\Sessions\AgentCallContext;
use App\Contracts\Sessions\AgentDirectory as AgentDirectoryContract;
use App\Contracts\Sessions\AgentRequestClient as AgentRequestClientContract;
use App\Contracts\Sessions\AgentResolver;
use App\Contracts\Sessions\CurrentSession;
use App\Contracts\Sessions\RuntimeResolver as RuntimeResolverContract;
use App\Contracts\Sessions\SessionPolicyReader as SessionPolicyReaderContract;
use App\Contracts\Sessions\SessionProvenance as SessionProvenanceContract;
use App\Contracts\Sessions\SessionRequestResolver as SessionRequestResolverContract;
use App\Contracts\Sessions\SessionResolver as SessionResolverContract;
use App\Contracts\Sessions\SessionStartCandidates as SessionStartCandidatesContract;
use App\Contracts\Sessions\SessionTokenSource as SessionTokenSourceContract;
use App\Contracts\Sessions\StartExecutor as StartExecutorContract;
use App\Contracts\Sessions\StartHeartbeats as StartHeartbeatsContract;
use App\Contracts\Sessions\StartPreflight as StartPreflightContract;
use App\Contracts\Sessions\StartReceipts as StartReceiptsContract;
use App\Contracts\Sessions\StartReservations as StartReservationsContract;
use App\Contracts\Sessions\StartTransaction;
use App\Contracts\Settings\SettingsResolver;
use App\Enums\Agents\AccessType;
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
use App\Resolvers\AccountUses;
use App\Resolvers\AgentAuthority;
use App\Resolvers\AgentDirectory;
use App\Resolvers\AgentLabels;
use App\Resolvers\CallingDriver;
use App\Resolvers\DriverConversationResolver;
use App\Resolvers\HostCapabilities;
use App\Resolvers\RuntimeResolver;
use App\Resolvers\SessionRequestResolver;
use App\Resolvers\SessionResolver;
use App\Resolvers\SessionStartCandidates;
use App\Resolvers\StartReceipts;
use App\Resolvers\Support\CurrentAgentRuntimes;
use App\Resolvers\Support\PendingStartSecrets;
use App\Resolvers\UnconfiguredAccounts;
use App\Support\ActiveActorRegistration;
use App\Support\ActivityDefinition;
use App\Support\ActivityLog;
use App\Support\ActivityRetentionService;
use App\Support\ActorAttention;
use App\Support\AgentActivity;
use App\Support\AgentActors;
use App\Support\AgentAssignees;
use App\Support\AgentClientSettings;
use App\Support\AgentContext;
use App\Support\AgentNotices;
use App\Support\AgentRequestClient;
use App\Support\AgentSessionCounter;
use App\Support\AgentVisibility;
use App\Support\ApiRegistrar;
use App\Support\ApiSender;
use App\Support\ArrangementSetting;
use App\Support\AssigneeDefinition;
use App\Support\CoreSettings;
use App\Support\DatabaseStartTransaction;
use App\Support\DockerImageVerifier;
use App\Support\DriverBudgets;
use App\Support\HostCalls;
use App\Support\InstallLineAvailability;
use App\Support\KeptInboxParticipation;
use App\Support\NavigationExpiry;
use App\Support\NavigationReader;
use App\Support\NavigationRequestProvider;
use App\Support\PendingNavigationWork;
use App\Support\PendingWorkSources;
use App\Support\PublishedReleases;
use App\Support\ReadGrant;
use App\Support\ReadinessCheckSweep;
use App\Support\RequestSession;
use App\Support\RuntimeStops;
use App\Support\ServerOrigin;
use App\Support\SessionOutputAccess;
use App\Support\SessionPolicyReader;
use App\Support\SessionProvenance;
use App\Support\SessionTokenSource;
use App\Support\StartEnvironment;
use App\Support\StartExecutor;
use App\Support\StartHeartbeats;
use App\Support\StartPreflight;
use App\Support\StartProfiles;
use App\Support\StartReservations;
use App\Support\SystemEntryPolicies;
use App\Support\TerminalViewCloser;
use App\Support\ToolDiscovery;
use App\Support\UnavailableAttachments;
use App\Support\WorkspaceReader;
use App\Values\FilePath;
use App\Values\HostCapacity;
use App\Values\PolicyDefinition;
use Carbon\CarbonImmutable;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Container\Container;
use Illuminate\Contracts\Config\Repository;
use Illuminate\Contracts\Events\Dispatcher;
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
        $this->app->bind(ActivityLogContract::class, ActivityLog::class);

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
        $this->app->bind(ToolDiscoveryContract::class, ToolDiscovery::class);
        $this->app->bind(WorkspaceReaderContract::class, WorkspaceReader::class);
        $this->app->bindIf(AttachmentReferences::class, UnavailableAttachments::class);
        $this->app->bindIf(InboxParticipationEnding::class, KeptInboxParticipation::class);
        $this->app->bind(RuntimeStopsContract::class, RuntimeStops::class);
        $this->app->bind(NavigationReaderContract::class, NavigationReader::class);
        $this->app->bind(TerminalViewCloserContract::class, TerminalViewCloser::class);

        $this->app->bind(StartExecutorContract::class, fn () => new StartExecutor(
            $this->app->make(Repository::class)->string('agents.host_start_socket'),
            $this->app->make(DriverCatalogue::class),
        ));

        $this->app->bind(RuntimeResolverContract::class, RuntimeResolver::class);
        $this->app->bind(SessionResolverContract::class, SessionResolver::class);
        $this->app->bind(AgentDirectoryContract::class, AgentDirectory::class);
        $this->app->bind(AgentRequestClientContract::class, AgentRequestClient::class);
        $this->app->bind(StartHeartbeatsContract::class, StartHeartbeats::class);
        $this->app->bind(NavigationExpiryContract::class, NavigationExpiry::class);
        $this->app->scoped(CurrentAgentRuntimes::class);
        $this->app->scoped(ActorAttentionContract::class, ActorAttention::class);
        $this->app->scoped(AgentContext::class, AgentContextMissing::throwing()->forRequest());
        $this->app->scoped(AgentAssignees::class);
        $this->app->bind(AgentAuthorityContract::class, AgentAuthority::class);
        $this->app->bind(ApiSenderContract::class, ApiSender::class);
        $this->app->bind(ApiRegistrarContract::class, ApiRegistrar::class);
        $this->app->bind(SessionRequestResolverContract::class, SessionRequestResolver::class);
        $this->app->bind(DriverConversationResolverContract::class, DriverConversationResolver::class);

        $this->app->bind(
            DockerImageVerifierContract::class,
            fn () => new DockerImageVerifier(
                $this->app->make(Files::class),
                FilePath::in(Place::Project, 'docs/accounts/docker-images.json'),
            ),
        );

        $this->app->bind(SessionPolicyReaderContract::class, SessionPolicyReader::class);
        $this->app->bind(SessionProvenanceContract::class, SessionProvenance::class);
        $this->app->bind(SessionStartCandidatesContract::class, SessionStartCandidates::class);
        $this->app->bind(StartReservationsContract::class, StartReservations::class);
        $this->app->bind(StartReceiptsContract::class, StartReceipts::class);
        $this->app->bind(CallingDriverContract::class, CallingDriver::class);

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

        $this->app->bind(HostCallsContract::class, HostCalls::class);

        $this->app->singleton(ServerOrigin::class, fn () => new ServerOrigin(
            $this->app->make('config')->string('agents.server_origin'),
            $this->app->isLocal(),
        ));

        $this->app->bind(StartProfiles::class, fn () => new StartProfiles(
            $this->app->make(ArrangementSetting::class),
            $this->app->make(HostCapabilitiesContract::class),
            StartProfiles::trialOf($this->app->make('config')->string('agents.protected_account_trial')),
        ));

        $this->app->singleton(HostCapacity::class, fn () => new HostCapacity(
            $this->app->make('config')->integer('agents.host_capacity.cpu_cores'),
            $this->app->make('config')->integer('agents.host_capacity.memory_bytes'),
            $this->app->make('config')->integer('agents.host_capacity.disk_bytes'),
            $this->app->make('config')->boolean('agents.host_capacity.guarded'),
        ));

        $this->app->scoped(PendingStartSecrets::class);

        $this->app->bind(
            HostCapabilitiesContract::class,
            fn () => new HostCapabilities(
                $this->app->make(Files::class),
                FilePath::in(Place::Project, 'docs/accounts/container-capabilities.json'),
            ),
        );

        $this->app->bindIf(StartTransaction::class, DatabaseStartTransaction::class);
        $this->app->bind(StartEnvironment::class, StartEnvironment::ofThisProcess(...));
        $this->app->bind(SessionTokenSourceContract::class, SessionTokenSource::class);
        $this->app->bindIf(ActiveAccountReader::class, UnconfiguredAccounts::class);
        $this->app->bind(StartPreflightContract::class, StartPreflight::class);
        $this->app->bind(AccountUsesContract::class, AccountUses::class);
        $this->app->bind(SessionOutputAccessContract::class, SessionOutputAccess::class);

        $this->app->bind(
            AgentClientSettings::class,
            fn ($app) => $app->make(SessionTokenSourceContract::class)->forThisStart(),
        );

        $this->app->singleton(PendingWorkSources::class);
    }

    public function boot(
        SystemEntryPolicies $systemEntries,
        AssignmentRegistration $assignments,
        ActorProviderRegistration $actors,
        ActiveActorRegistration $presentActors,
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
        $systemEntries->allow(AgentNotices::TRUSTED_ENTRY, AgentPolicy::class);
        $actors->register(Agent::class, AgentActors::class);
        $actors->registerLabels(Agent::class, AgentLabels::class);
        $actors->registerVisibility(Agent::class, AgentVisibility::class);
        $this->loadCoreRoutes('agents/agents.php');
        $this->loadCoreRoutes('agents/host.php');
        $this->loadCoreRoutes('agents/releases.php');

        $assignments->registerAssignees(new AssigneeDefinition(Agent::storedType(), AgentAssignees::class));

        $assignments->registerOwner(self::OWNER, []);

        $assignments->registerRecord(
            NavigationRequest::linkType(),
            NavigationRequestProvider::class,
            self::OWNER,
            AssignmentPurpose::InternalResponsibility,
        );

        $pendingWork->register(PendingNavigationWork::class);
        $assignments->registerActivity(new ActivityDefinition(Agent::storedType(), AgentActivity::class));
        $presentActors->register(AgentSessionCounter::class);
    }
}
