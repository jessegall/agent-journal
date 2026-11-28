<?php

declare(strict_types=1);

namespace App\Providers;

use App\Access\Contracts\AgentAuthority as AgentAuthorityContract;
use App\Access\Contracts\AuthorizerProviderRegistration;
use App\Access\Contracts\PolicyCatalogue;
use App\Access\Contracts\ReadGrant as ReadGrantContract;
use App\Access\SystemEntryPolicies;
use App\Access\Values\PolicyDefinition;
use App\Accounts\Contracts\AccountUses as AccountUsesContract;
use App\Accounts\Contracts\ActiveAccountReader;
use App\Actors\ActiveActorRegistration;
use App\Actors\ActorAttention;
use App\Actors\Contracts\ActorAttention as ActorAttentionContract;
use App\Actors\Contracts\ActorProviderRegistration;
use App\Actors\Contracts\CurrentActor;
use App\Actors\Contracts\CurrentAgentRuntimes as CurrentAgentRuntimesContract;
use App\Actors\Resolvers\CurrentAgentRuntimes;
use App\Agents\Activity\Contracts\ActivityLog as ActivityLogContract;
use App\Agents\ActivityLog;
use App\Agents\ActivityRetentionService;
use App\Agents\AgentActivity;
use App\Agents\AgentActors;
use App\Agents\AgentAssignees;
use App\Agents\AgentDrivers;
use App\Agents\AgentNotices;
use App\Agents\AgentSessionCounter;
use App\Agents\AgentVisibility;
use App\Agents\Contracts\AgentDrivers as AgentDriversContract;
use App\Agents\Contracts\RunningTools as RunningToolsContract;
use App\Agents\DriverBudgets;
use App\Agents\Drivers\Contracts\AttachmentReferences;
use App\Agents\Drivers\Contracts\DriverConversationResolver as DriverConversationResolverContract;
use App\Agents\Drivers\Contracts\ToolDiscovery as ToolDiscoveryContract;
use App\Agents\Enums\AccessType;
use App\Agents\RequestSession;
use App\Agents\Resolvers\Support\PendingStartSecrets;
use App\Agents\RunningTools;
use App\Agents\ToolDiscovery;
use App\Agents\UnavailableAttachments;
use App\Api\ApiSender;
use App\Api\Contracts\Domains\ApiSender as ApiSenderContract;
use App\Assignments\ActivityDefinition;
use App\Assignments\AssigneeDefinition;
use App\Assignments\Contracts\AssignmentRegistration;
use App\Assignments\Enums\AssignmentPurpose;
use App\Concerns\LoadsCoreRoutes;
use App\Connections\InstallLineAvailability;
use App\Connections\PublishedReleases;
use App\Connections\ServerOrigin;
use App\Contracts\Domains\ApiRegistrar as ApiRegistrarContract;
use App\Files\Contracts\Files;
use App\Files\Contracts\WorkspaceReader as WorkspaceReaderContract;
use App\Files\Enums\Place;
use App\Hosts\ArrangementSetting;
use App\Hosts\Contracts\DockerImageVerifier as DockerImageVerifierContract;
use App\Hosts\Contracts\HostCapabilities as HostCapabilitiesContract;
use App\Hosts\Contracts\SignedHostCalls as SignedHostCallsContract;
use App\Hosts\JournalHostCalls;
use App\Hosts\Protocol\HostCalls;
use App\Hosts\SignedHostCalls;
use App\Inboxes\Contracts\InboxParticipationEnding;
use App\Inboxes\KeptInboxParticipation;
use App\Models\Agents\Agent;
use App\Models\Drivers\NavigationRequest;
use App\Models\Sessions\SessionProcess;
use App\Models\Support\SessionProcessScope;
use App\Navigation\Contracts\NavigationExpiry as NavigationExpiryContract;
use App\Navigation\Contracts\NavigationReader as NavigationReaderContract;
use App\Navigation\Contracts\TerminalViewCloser as TerminalViewCloserContract;
use App\Navigation\NavigationExpiry;
use App\Navigation\NavigationReader;
use App\Navigation\NavigationRequestProvider;
use App\Navigation\PendingNavigationWork;
use App\Policies\ActivityPolicy;
use App\Policies\AgentMaintenancePolicy;
use App\Policies\AgentPolicy;
use App\Policies\AgentTerminalControlPolicy;
use App\Projects\WorkspaceReader;
use App\Reads\Contracts\SessionOutputAccess as SessionOutputAccessContract;
use App\Reads\ReadGrant;
use App\Resolvers\AccountUses;
use App\Resolvers\AgentAuthority;
use App\Resolvers\AgentDirectory;
use App\Resolvers\AgentLabels;
use App\Resolvers\DriverConversationResolver;
use App\Resolvers\HostCapabilities;
use App\Resolvers\RuntimeResolver;
use App\Resolvers\SessionRequestResolver;
use App\Resolvers\SessionResolver;
use App\Resolvers\UnconfiguredAccounts;
use App\Sessions\AgentClientSettings;
use App\Sessions\Contracts\AgentCallContext;
use App\Sessions\Contracts\AgentDirectory as AgentDirectoryContract;
use App\Sessions\Contracts\AgentResolver;
use App\Sessions\Contracts\CurrentSession;
use App\Sessions\Contracts\RuntimeResolver as RuntimeResolverContract;
use App\Sessions\Contracts\SessionPolicyReader as SessionPolicyReaderContract;
use App\Sessions\Contracts\SessionProvenance as SessionProvenanceContract;
use App\Sessions\Contracts\SessionRequestResolver as SessionRequestResolverContract;
use App\Sessions\Contracts\SessionResolver as SessionResolverContract;
use App\Sessions\Contracts\SessionTokenSource as SessionTokenSourceContract;
use App\Sessions\Contracts\StartHeartbeats as StartHeartbeatsContract;
use App\Sessions\Contracts\StartPreflight as StartPreflightContract;
use App\Sessions\Contracts\StartTransaction;
use App\Sessions\DatabaseStartTransaction;
use App\Sessions\Exceptions\AgentContextMissing;
use App\Sessions\ReadinessCheckSweep;
use App\Sessions\SessionOutputAccess;
use App\Sessions\SessionPolicyReader;
use App\Sessions\SessionProvenance;
use App\Sessions\SessionTokenSource;
use App\Sessions\StartEnvironment;
use App\Sessions\StartHeartbeats;
use App\Sessions\StartPreflight;
use App\Settings\Contracts\SettingsResolver;
use App\Settings\CoreSettings;
use App\Stacks\PendingWorkSources;
use App\Support\AgentContext;
use App\Support\ApiRegistrar;
use App\Support\DockerImageVerifier;
use App\Terminals\TerminalViewCloser;
use App\Values\FilePath;
use Carbon\CarbonImmutable;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Container\Container;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Support\ServiceProvider;
use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;

/**
 * Gives each request its own agent context, which only the agent middleware fills; without it, asking for one fails.
 * A start runs in a plain transaction until another domain supplies a bounded one. Agents are registered as holders
 * of assigned work.
 */
final class AgentsServiceProvider extends ServiceProvider
{
    use LoadsCoreRoutes;

    private const string OWNER = 'Agents';

    public function register(): void
    {
        $this->app->bind(AgentDriversContract::class, AgentDrivers::class);
        $this->app->bind(ReadGrantContract::class, ReadGrant::class);
        $this->app->bind(AgentResolver::class, AgentLabels::class);
        $this->app->bind(ActivityLogContract::class, ActivityLog::class);
        $this->app->bind(RunningToolsContract::class, RunningTools::class);
        $this->app->bind(HostCalls::class, JournalHostCalls::class);

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
        $this->app->bind(NavigationReaderContract::class, NavigationReader::class);
        $this->app->bind(TerminalViewCloserContract::class, TerminalViewCloser::class);

        $this->app->bind(RuntimeResolverContract::class, RuntimeResolver::class);
        $this->app->bind(SessionResolverContract::class, SessionResolver::class);
        $this->app->bind(AgentDirectoryContract::class, AgentDirectory::class);
        $this->app->bind(StartHeartbeatsContract::class, StartHeartbeats::class);
        $this->app->bind(NavigationExpiryContract::class, NavigationExpiry::class);
        $this->app->scoped(CurrentAgentRuntimesContract::class, CurrentAgentRuntimes::class);
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

        $this->app->singleton(DriverBudgets::class, fn () => new DriverBudgets(
            $this->app->make('config')->integer('journal.agents.driver_budgets.claim_batch_max'),
            $this->app->make('config')->integer('journal.agents.driver_budgets.long_poll_max_seconds'),
            $this->app->make('config')->integer('journal.agents.driver_budgets.deliver_max_bytes'),
        ));

        $this->app->singleton(ArrangementSetting::class, fn () => ArrangementSetting::fromConfig(
            $this->app->make('config')->string('journal.agents.arrangement'),
            $this->app->make('config')->string('journal.agents.installation_name'),
            $this->app->make('config')->string('journal.agents.workspaces'),
        ));

        $this->app->singleton(PublishedReleases::class, fn () => new PublishedReleases(
            $this->app->make(Files::class),
            $this->app->make('config')->string('journal.agents.release'),
        ));

        $this->app->bind(InstallLineAvailability::class, fn () => new InstallLineAvailability(
            $this->app->make(SettingsResolver::class),
            $this->app->make(CoreSettings::class),
            $this->app->make(PublishedReleases::class),
            $this->app->make(ServerOrigin::class),
        ));

        $this->app->bind(SignedHostCallsContract::class, SignedHostCalls::class);

        $this->app->singleton(ServerOrigin::class, fn () => new ServerOrigin(
            $this->app->make('config')->string('journal.agents.server_origin'),
            $this->app->isLocal(),
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
            [AccessType::Read, AccessType::Create, AccessType::Edit, AccessType::Delete, AccessType::Admin],
        ));

        $policies->register('Core', new PolicyDefinition(
            AgentMaintenancePolicy::class,
            [AccessType::Read, AccessType::Create, AccessType::Edit, AccessType::Execute],
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
        $this->loadCoreRoutes('agents/host-protocol.php');
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
