<?php

declare(strict_types=1);

namespace App\Agents\Providers;

use App\Actors\Enums\ActorType;
use App\AgentRequests\Actions\SendAgentRequests;
use App\AgentRequests\Contracts\AgentRequestSender;
use App\AgentRequests\Support\AgentClientSettings;
use App\Agents\Actions\RetireAgent;
use App\Agents\Console\RetireAgentCommand;
use App\Agents\Contracts\AgentRetirement;
use App\Agents\Exceptions\AgentContextMissing;
use App\Agents\Readers\AgentAuthorityRecords;
use App\Agents\Support\AgentAssignees;
use App\Agents\Support\AgentContext;
use App\Agents\Support\DatabaseLaunchTransaction;
use App\Agents\Support\LaunchTimeouts;
use App\Assignments\Contracts\AgentAuthority;
use App\Assignments\Contracts\AssignmentRegistration;
use App\Assignments\Support\AssigneeRegistration;
use App\Contracts\LaunchTransaction;
use Illuminate\Support\ServiceProvider;

/**
 * Gives each request its own agent context, which only the agent middleware fills; without it, asking for one fails. A launch runs in a plain transaction until another domain supplies a bounded one. Agents are registered as holders of
 * assigned work.
 */
final class AgentsServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->scoped(AgentContext::class, fn () => throw AgentContextMissing::forRequest());
        $this->app->scoped(AgentAssignees::class);
        $this->app->bind(AgentAuthority::class, AgentAuthorityRecords::class);
        $this->app->scoped(AgentRetirement::class, RetireAgent::class);
        $this->app->bindIf(LaunchTransaction::class, DatabaseLaunchTransaction::class);
        $this->app->bind(AgentClientSettings::class, fn () => AgentClientSettings::fromEnvironment(array_filter(getenv(), is_string(...))));
        $this->app->bind(AgentRequestSender::class, SendAgentRequests::class);
        $this->app->singleton(LaunchTimeouts::class, fn () => new LaunchTimeouts(
            $this->app->make('config')->integer('agents.silent_after_seconds'),
            $this->app->make('config')->integer('agents.timed_out_after_seconds'),
        ));
    }

    public function boot(AssignmentRegistration $assignments): void
    {
        $this->loadRoutesFrom(dirname(__DIR__).'/Routes/agents.php');
        $this->commands([RetireAgentCommand::class]);
        $assignments->registerAssignees(new AssigneeRegistration(ActorType::Agent, AgentAssignees::class));
    }
}
