<?php

declare(strict_types=1);

namespace App\Agents\Providers;

use App\Actors\Contracts\ActorProviderRegistration;
use App\Actors\Enums\ActorType;
use App\Actors\Support\ActiveActorCounterRegistry;
use App\AgentRequests\Actions\SendAgentRequests;
use App\AgentRequests\Contracts\AgentRequestSender;
use App\AgentRequests\Contracts\LaunchCredentialSource;
use App\AgentRequests\Support\AgentClientSettings;
use App\AgentRequests\Support\EnvironmentCredentialSource;
use App\Agents\Console\EnrollHostCommand;
use App\Agents\Console\RetireAgentCommand;
use App\Agents\Contracts\HostCapabilities;
use App\Agents\Exceptions\AgentContextMissing;
use App\Agents\Readers\AgentAuthorityRecords;
use App\Agents\Readers\RecordedHostCapabilities;
use App\Agents\Support\AgentActors;
use App\Agents\Support\AgentAssignees;
use App\Agents\Support\AgentContext;
use App\Agents\Support\AgentSessionCounter;
use App\Agents\Support\DatabaseLaunchTransaction;
use App\Agents\Support\RequestSession;
use App\Assignments\Contracts\AgentAuthority;
use App\Assignments\Contracts\AssignmentRegistration;
use App\Assignments\Support\AssigneeRegistration;
use App\Bus\Contracts\CallerSession;
use App\Contracts\LaunchTransaction;
use Illuminate\Support\ServiceProvider;

/**
 * Gives each request its own agent context, which only the agent middleware fills; without it, asking for one fails. A launch runs in a plain transaction until another domain supplies a bounded one. Agents are registered as holders of
 * assigned work, and their present sessions are counted for ActiveActors.
 */
final class AgentsServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->scoped(AgentContext::class, fn () => throw AgentContextMissing::forRequest());
        $this->app->scoped(AgentAssignees::class);
        $this->app->bind(AgentAuthority::class, AgentAuthorityRecords::class);
        $this->app->bind(HostCapabilities::class, fn () => new RecordedHostCapabilities(base_path('docs/accounts/container-capabilities.json')));
        $this->app->bindIf(LaunchTransaction::class, DatabaseLaunchTransaction::class);
        $this->app->bind(LaunchCredentialSource::class, fn () => new EnvironmentCredentialSource(array_filter(getenv(), is_string(...))));
        $this->app->bind(AgentClientSettings::class, fn ($app) => $app->make(LaunchCredentialSource::class)->forThisLaunch());
        $this->app->bind(AgentRequestSender::class, SendAgentRequests::class);
        $this->app->bind(CallerSession::class, RequestSession::class);
    }

    public function boot(AssignmentRegistration $assignments, ActorProviderRegistration $actors, ActiveActorCounterRegistry $presentActors): void
    {
        $actors->register(ActorType::Agent, AgentActors::class);
        $this->loadRoutesFrom(dirname(__DIR__).'/Routes/agents.php');
        $this->loadRoutesFrom(dirname(__DIR__).'/Routes/host.php');
        $this->commands([RetireAgentCommand::class, EnrollHostCommand::class]);
        $assignments->registerAssignees(new AssigneeRegistration(ActorType::Agent, AgentAssignees::class));
        $presentActors->register(AgentSessionCounter::class);
    }
}
