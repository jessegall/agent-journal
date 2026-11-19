<?php

declare(strict_types=1);

namespace App\Agents\Providers;

use App\Actors\Contracts\ActorAttention;
use App\Actors\Contracts\ActorProviderRegistration;
use App\Actors\Contracts\AuthorizerProviderRegistration;
use App\Actors\Contracts\PolicyCatalogue;
use App\Actors\Enums\ActorType;
use App\Actors\Support\ActiveActorCounterRegistry;
use App\Actors\Values\PolicyRegistration;
use App\AgentRequests\Actions\SendAgentRequests;
use App\AgentRequests\Console\GenerateCallsCommand;
use App\AgentRequests\Contracts\AgentRequestSender;
use App\AgentRequests\Contracts\CallSender;
use App\AgentRequests\Contracts\LaunchCredentialSource;
use App\AgentRequests\Contracts\RegistersCalls;
use App\AgentRequests\Support\AgentClientSettings;
use App\AgentRequests\Support\CallRoutes;
use App\AgentRequests\Support\EnvironmentCredentialSource;
use App\AgentRequests\Support\SendSignedCalls;
use App\Agents\Console\EnrollHostCommand;
use App\Agents\Console\RetireAgentCommand;
use App\Agents\Console\RunKeyScriptCommand;
use App\Agents\Contracts\ActorRuntimeResolver;
use App\Agents\Contracts\HelperImages;
use App\Agents\Contracts\HostCapabilities;
use App\Agents\Contracts\LaunchMaterialResolver;
use App\Agents\Contracts\LaunchRecordResolver;
use App\Agents\Contracts\ProgramConversationResolver;
use App\Agents\Enums\AgentAbility;
use App\Agents\Exceptions\AgentContextMissing;
use App\Agents\Models\Agent;
use App\Agents\Policies\AgentPolicy;
use App\Agents\Resolvers\AgentAuthorityRecords;
use App\Agents\Resolvers\AgentLabels;
use App\Agents\Resolvers\CurrentAgentRuntimes;
use App\Agents\Resolvers\HostLaunchMaterial;
use App\Agents\Resolvers\LaunchRecords;
use App\Agents\Resolvers\ProgramConversationRecords;
use App\Agents\Resolvers\RecordedHostCapabilities;
use App\Agents\Resolvers\VerifiedHelperImages;
use App\Agents\Support\AgentActivity;
use App\Agents\Support\AgentActors;
use App\Agents\Support\AgentAssignees;
use App\Agents\Support\AgentContext;
use App\Agents\Support\AgentSessionCounter;
use App\Agents\Support\AgentVisibility;
use App\Agents\Support\CurrentRuntimeAttention;
use App\Agents\Support\DatabaseLaunchTransaction;
use App\Agents\Support\HostCapacity;
use App\Agents\Support\PendingWorkSources;
use App\Agents\Support\RequestSession;
use App\Assignments\Contracts\AgentAuthority;
use App\Assignments\Contracts\AssignmentRegistration;
use App\Assignments\Support\ActivityRegistration;
use App\Assignments\Support\AssigneeRegistration;
use App\Bus\Contracts\CallerSession;
use App\Contracts\LaunchTransaction;
use Illuminate\Support\ServiceProvider;

/**
 * Gives each request its own agent context, which only the agent middleware fills; without it, asking for one fails.
 * A launch runs in a plain transaction until another domain supplies a bounded one. Agents are registered as holders
 * of
 * assigned work, and their present sessions are counted for ActiveActors.
 */
final class AgentsServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->scoped(ActorRuntimeResolver::class, CurrentAgentRuntimes::class);
        $this->app->scoped(ActorAttention::class, CurrentRuntimeAttention::class);
        $this->app->scoped(AgentContext::class, fn () => throw AgentContextMissing::forRequest());
        $this->app->scoped(AgentAssignees::class);
        $this->app->bind(AgentAuthority::class, AgentAuthorityRecords::class);
        $this->app->bind(CallSender::class, SendSignedCalls::class);
        $this->app->bind(RegistersCalls::class, CallRoutes::class);
        $this->app->bind(LaunchRecordResolver::class, LaunchRecords::class);
        $this->app->bind(ProgramConversationResolver::class, ProgramConversationRecords::class);
        $this->app->bind(
            HelperImages::class,
            fn () => new VerifiedHelperImages(base_path('docs/accounts/helper-image.json')),
        );
        $this->app->singleton(HostCapacity::class, fn () => new HostCapacity(
            $this->app->make('config')->integer('agents.host_capacity.cpu_cores'),
            $this->app->make('config')->integer('agents.host_capacity.memory_bytes'),
            $this->app->make('config')->integer('agents.host_capacity.disk_bytes'),
        ));
        $this->app->scoped(HostLaunchMaterial::class);
        $this->app->bind(LaunchMaterialResolver::class, HostLaunchMaterial::class);
        $this->app->bind(
            HostCapabilities::class,
            fn () => new RecordedHostCapabilities(base_path('docs/accounts/container-capabilities.json')),
        );
        $this->app->bindIf(LaunchTransaction::class, DatabaseLaunchTransaction::class);
        $this->app->bind(
            LaunchCredentialSource::class,
            fn () => new EnvironmentCredentialSource(array_filter(getenv(), is_string(...))),
        );
        $this->app->bind(
            AgentClientSettings::class,
            fn ($app) => $app->make(LaunchCredentialSource::class)->forThisLaunch(),
        );
        $this->app->bind(AgentRequestSender::class, SendAgentRequests::class);
        $this->app->bind(CallerSession::class, RequestSession::class);
        $this->app->singleton(PendingWorkSources::class);
    }

    public function boot(
        AssignmentRegistration $assignments,
        ActorProviderRegistration $actors,
        ActiveActorCounterRegistry $presentActors,
        AuthorizerProviderRegistration $authorizers,
        PolicyCatalogue $policies,
    ): void {
        $policies->register('Core', new PolicyRegistration(
            Agent::class,
            AgentPolicy::class,
            AgentAbility::class,
            ownerOnly: [AgentAbility::RunKeyScript, AgentAbility::Inspect, AgentAbility::Steer],
            coordinatorOnly: [AgentAbility::RetireOthers],
        ));
        $actors->register(ActorType::Agent, AgentActors::class);
        $actors->registerLabels(ActorType::Agent, AgentLabels::class);
        $actors->registerVisibility(ActorType::Agent, AgentVisibility::class);
        $this->loadRoutesFrom(dirname(__DIR__).'/Routes/agents.php');
        $this->loadRoutesFrom(dirname(__DIR__).'/Routes/host.php');
        $this->commands([
            RetireAgentCommand::class,
            EnrollHostCommand::class,
            RunKeyScriptCommand::class,
            GenerateCallsCommand::class,
        ]);
        $assignments->registerAssignees(new AssigneeRegistration(ActorType::Agent->value, AgentAssignees::class));
        $assignments->registerActivity(new ActivityRegistration(ActorType::Agent, AgentActivity::class));
        $presentActors->register(AgentSessionCounter::class);
    }
}
