<?php

declare(strict_types=1);

namespace App\Core\Agents\Providers;

use App\Core\Actors\Enums\ActorKind;
use App\Core\Agents\Contracts\AgentAuthority;
use App\Core\Agents\Exceptions\AgentContextMissing;
use App\Core\Agents\Readers\AgentAuthorityRecords;
use App\Core\Agents\Support\AgentAssignees;
use App\Core\Agents\Support\AgentContext;
use App\Core\Agents\Support\DatabaseLaunchTransaction;
use App\Core\Agents\Support\LaunchTimeouts;
use App\Core\Assignments\Contracts\AssignmentRegistration;
use App\Core\Assignments\Support\AssigneeRegistration;
use App\Core\Contracts\LaunchTransaction;
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
        $this->app->bindIf(LaunchTransaction::class, DatabaseLaunchTransaction::class);
        $this->app->singleton(LaunchTimeouts::class, fn () => new LaunchTimeouts(
            $this->app->make('config')->integer('agents.possibly_lost_after_seconds'),
            $this->app->make('config')->integer('agents.lost_after_seconds'),
        ));
    }

    public function boot(AssignmentRegistration $assignments): void
    {
        $assignments->registerAssignees(new AssigneeRegistration(ActorKind::Agent, AgentAssignees::class));
    }
}
