<?php

declare(strict_types=1);

namespace App\Agents\Providers;

use App\Actors\Contracts\ActorAttention;
use App\Actors\Contracts\ActorProviderRegistration;
use App\Actors\Contracts\AuthorizerProviderRegistration;
use App\Actors\Contracts\CurrentActor;
use App\Actors\Contracts\PolicyCatalogue;
use App\Actors\Enums\ActorType;
use App\Actors\Support\ActiveActorCounterRegistry;
use App\Actors\Support\SystemEntryPolicies;
use App\Actors\Values\PolicyDefinition;
use App\AgentRequests\Console\GenerateCallsCommand;
use App\AgentRequests\Contracts\AgentRequestClient as AgentRequestClientContract;
use App\AgentRequests\Contracts\CallRegistrar;
use App\AgentRequests\Contracts\CallSender;
use App\AgentRequests\Contracts\StartTokenSource;
use App\AgentRequests\Support\AgentClientSettings;
use App\AgentRequests\Support\AgentRequestClient;
use App\AgentRequests\Support\CallRoutes;
use App\AgentRequests\Support\EnvironmentCredentialSource;
use App\AgentRequests\Support\SignedCallSender;
use App\AgentRequests\Support\StartEnvironment;
use App\Agents\Actions\ReserveStarts;
use App\Agents\Actions\SignedHostCalls;
use App\Agents\Actions\StartHeartbeats;
use App\Agents\Contracts\AccountUses;
use App\Agents\Contracts\ActiveAccountReader;
use App\Agents\Contracts\AgentCallContext;
use App\Agents\Contracts\AgentDirectory;
use App\Agents\Contracts\AgentResolver;
use App\Agents\Contracts\CallingDriver;
use App\Agents\Contracts\CurrentSession;
use App\Agents\Contracts\DockerImageVerifier as DockerImageVerifierContract;
use App\Agents\Contracts\DriverConversationResolver;
use App\Agents\Contracts\HelperCommitImport as HelperCommitImportContract;
use App\Agents\Contracts\HostCalls;
use App\Agents\Contracts\HostCapabilities;
use App\Agents\Contracts\LaunchCandidates;
use App\Agents\Contracts\MergeAdmission;
use App\Agents\Contracts\NavigationExpiry as NavigationExpiryContract;
use App\Agents\Contracts\NavigationReader;
use App\Agents\Contracts\ReadGrant as ReadGrantContract;
use App\Agents\Contracts\RuntimeResolver;
use App\Agents\Contracts\RuntimeStops;
use App\Agents\Contracts\SessionOutputAccess;
use App\Agents\Contracts\SessionPolicyReader;
use App\Agents\Contracts\SessionProvenance as SessionProvenanceContract;
use App\Agents\Contracts\SessionResolver;
use App\Agents\Contracts\StartExecutor;
use App\Agents\Contracts\StartHeartbeats as StartHeartbeatsContract;
use App\Agents\Contracts\StartPreflight;
use App\Agents\Contracts\StartReceipts;
use App\Agents\Contracts\StartRecordResolver;
use App\Agents\Contracts\StartReservations;
use App\Agents\Contracts\TerminalViewCloser;
use App\Agents\Contracts\ToolDiscovery;
use App\Agents\Contracts\WorkspaceReader;
use App\Agents\Exceptions\AgentContextMissing;
use App\Agents\Models\Agent;
use App\Agents\Models\NavigationRequest;
use App\Agents\Models\ProcessStart;
use App\Agents\Models\Support\ProcessStartScope;
use App\Agents\Policies\AgentMaintenancePolicy;
use App\Agents\Policies\AgentPolicy;
use App\Agents\Resolvers\AgentAuthorityRecords;
use App\Agents\Resolvers\AgentLabels;
use App\Agents\Resolvers\AgentLaunchCandidates;
use App\Agents\Resolvers\AgentRecords;
use App\Agents\Resolvers\CallingSessionDriver;
use App\Agents\Resolvers\DriverConversationRecords;
use App\Agents\Resolvers\LinkedAccountUses;
use App\Agents\Resolvers\OwnerStartReceipts;
use App\Agents\Resolvers\RecordedHostCapabilities;
use App\Agents\Resolvers\RuntimeRecords;
use App\Agents\Resolvers\SessionRecords;
use App\Agents\Resolvers\StartRecords;
use App\Agents\Resolvers\Support\CurrentAgentRuntimes;
use App\Agents\Resolvers\Support\PendingStartSecrets;
use App\Agents\Resolvers\UnconfiguredAccounts;
use App\Agents\Support\AgentActivity;
use App\Agents\Support\AgentActors;
use App\Agents\Support\AgentAssignees;
use App\Agents\Support\AgentContext;
use App\Agents\Support\AgentSessionCounter;
use App\Agents\Support\AgentVisibility;
use App\Agents\Support\ArrangementSetting;
use App\Agents\Support\CurrentRuntimeAttention;
use App\Agents\Support\DatabaseStartTransaction;
use App\Agents\Support\DockerImageVerifier;
use App\Agents\Support\DriverBudgets;
use App\Agents\Support\DriverRuntimeStops;
use App\Agents\Support\FrozenSessionPolicies;
use App\Agents\Support\GrantedSessionOutputs;
use App\Agents\Support\HelperCommitImport;
use App\Agents\Support\HostStartExecutor;
use App\Agents\Support\HostStartPreflight;
use App\Agents\Support\InstallLineAvailability;
use App\Agents\Support\LaunchProfiles;
use App\Agents\Support\NavigationExpiry;
use App\Agents\Support\NavigationRecords;
use App\Agents\Support\NavigationRequestProvider;
use App\Agents\Support\PendingNavigationWork;
use App\Agents\Support\PendingWorkSources;
use App\Agents\Support\ProtectedMerge;
use App\Agents\Support\PublishedReleases;
use App\Agents\Support\ReadGrant;
use App\Agents\Support\RequestSession;
use App\Agents\Support\RetainedWorkspaceReads;
use App\Agents\Support\ServerOrigin;
use App\Agents\Support\SessionProvenance;
use App\Agents\Support\SessionToolDiscovery;
use App\Agents\Support\TerminalViews;
use App\Agents\Support\UnavailableMergeAdmission;
use App\Agents\Values\HostCapacity;
use App\Assignments\Contracts\AgentAuthority;
use App\Assignments\Contracts\AssignmentRegistration;
use App\Assignments\Enums\AssignmentPurpose;
use App\Assignments\Support\ActivityDefinition;
use App\Assignments\Support\AssigneeDefinition;
use App\Autoload\Support\FolderClasses;
use App\Contracts\StartTransaction;
use App\Files\Contracts\Files;
use App\Files\Enums\Place;
use App\Files\Values\FilePath;
use App\Links\Support\LinkTypeRegistry;
use App\Operations\Enums\AccessType;
use App\Settings\Contracts\SettingsResolver;
use App\Settings\Support\CoreSettings;
use Illuminate\Console\Command;
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
    private const string OWNER = 'Agents';

    public function register(): void
    {
        $this->app->bind(ReadGrantContract::class, ReadGrant::class);
        $this->app->bind(AgentResolver::class, AgentLabels::class);

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
        $this->app->bind(RuntimeStops::class, DriverRuntimeStops::class);
        $this->app->bind(NavigationReader::class, NavigationRecords::class);
        $this->app->bind(TerminalViewCloser::class, TerminalViews::class);

        $this->app->bind(StartExecutor::class, fn () => new HostStartExecutor(
            $this->app->make(Repository::class)->string('agents.host_start_socket'),
        ));

        $this->app->bind(RuntimeResolver::class, RuntimeRecords::class);
        $this->app->bind(SessionResolver::class, SessionRecords::class);
        $this->app->bind(AgentDirectory::class, AgentRecords::class);
        $this->app->bind(AgentRequestClientContract::class, AgentRequestClient::class);
        $this->app->bind(StartHeartbeatsContract::class, StartHeartbeats::class);
        $this->app->bind(NavigationExpiryContract::class, NavigationExpiry::class);
        $this->app->scoped(CurrentAgentRuntimes::class);
        $this->app->scoped(ActorAttention::class, CurrentRuntimeAttention::class);
        $this->app->scoped(AgentContext::class, fn () => throw AgentContextMissing::forRequest());
        $this->app->scoped(AgentAssignees::class);
        $this->app->bind(AgentAuthority::class, AgentAuthorityRecords::class);
        $this->app->bind(CallSender::class, SignedCallSender::class);
        $this->app->bind(CallRegistrar::class, CallRoutes::class);
        $this->app->bind(StartRecordResolver::class, StartRecords::class);
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
        $this->app->bind(StartTokenSource::class, EnvironmentCredentialSource::class);
        $this->app->bindIf(ActiveAccountReader::class, UnconfiguredAccounts::class);
        $this->app->bind(StartPreflight::class, HostStartPreflight::class);
        $this->app->bind(AccountUses::class, LinkedAccountUses::class);
        $this->app->bind(SessionOutputAccess::class, GrantedSessionOutputs::class);

        $this->app->bind(
            AgentClientSettings::class,
            fn ($app) => $app->make(StartTokenSource::class)->forThisStart(),
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
        LinkTypeRegistry $links,
        Dispatcher $events,
        // read at boot so an unknown AGENTS_ARRANGEMENT stops the journal at once, naming the value
        ArrangementSetting $arrangement,
    ): void {
        $starts = new ProcessStartScope(static fn () => Container::getInstance()->make(CurrentActor::class));
        $events->listen('eloquent.booted: '.ProcessStart::class, fn () => ProcessStart::addGlobalScope($starts));

        $policies->register('Core', new PolicyDefinition(
            AgentPolicy::class,
            [AccessType::Read, AccessType::Create, AccessType::Edit, AccessType::Delete],
        ));

        $policies->register('Core', new PolicyDefinition(
            AgentMaintenancePolicy::class,
            [AccessType::Read, AccessType::Create, AccessType::Edit, AccessType::Execute],
        ));

        $systemEntries->allow('account reconciliation', AgentMaintenancePolicy::class);
        $systemEntries->allow('main agent install', AgentPolicy::class);
        $systemEntries->allow('driver switch', AgentPolicy::class);
        $actors->register(ActorType::Agent, AgentActors::class);
        $actors->registerLabels(ActorType::Agent, AgentLabels::class);
        $actors->registerVisibility(ActorType::Agent, AgentVisibility::class);
        $this->loadRoutesFrom(dirname(__DIR__).'/Routes/agents.php');
        $this->loadRoutesFrom(dirname(__DIR__).'/Routes/host.php');
        $this->loadRoutesFrom(dirname(__DIR__).'/Routes/releases.php');

        $this->commands([
            ...FolderClasses::in(dirname(__DIR__).'/Console', Command::class),
            GenerateCallsCommand::class,
        ]);

        $assignments->registerAssignees(new AssigneeDefinition(ActorType::Agent->value, AgentAssignees::class));
        $links->register([NavigationRequest::LINK_TYPE => NavigationRequest::class]);
        $assignments->registerOwner(self::OWNER, []);

        $assignments->registerRecord(
            NavigationRequest::LINK_TYPE,
            NavigationRequestProvider::class,
            self::OWNER,
            AssignmentPurpose::InternalResponsibility,
        );

        $pendingWork->register(PendingNavigationWork::class);
        $assignments->registerActivity(new ActivityDefinition(ActorType::Agent, AgentActivity::class));
        $presentActors->register(AgentSessionCounter::class);
    }
}
