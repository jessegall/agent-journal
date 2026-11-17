<?php

declare(strict_types=1);

namespace App\Core\Agents\Providers;

use App\Core\Agents\Exceptions\AgentContextMissing;
use App\Core\Agents\Support\AgentContext;
use App\Core\Agents\Support\DatabaseLaunchTransaction;
use App\Core\Agents\Support\LaunchTimeouts;
use App\Core\Contracts\LaunchTransaction;
use Illuminate\Support\ServiceProvider;

/**
 * Gives each request its own agent context, which only the agent middleware fills; without it, asking for one fails. A launch runs in a plain transaction until another domain supplies a bounded one.
 */
final class AgentsServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->scoped(AgentContext::class, fn () => throw AgentContextMissing::forRequest());
        $this->app->bindIf(LaunchTransaction::class, DatabaseLaunchTransaction::class);
        $this->app->singleton(LaunchTimeouts::class, fn () => new LaunchTimeouts(
            $this->app->make('config')->integer('agents.possibly_lost_after_seconds'),
            $this->app->make('config')->integer('agents.lost_after_seconds'),
        ));
    }
}
