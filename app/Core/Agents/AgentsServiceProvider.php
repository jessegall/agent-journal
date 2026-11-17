<?php

declare(strict_types=1);

namespace App\Core\Agents;

use App\Core\Agents\Exceptions\AgentContextMissing;
use Illuminate\Support\ServiceProvider;

/**
 * Gives each request its own agent context, which only the agent middleware fills; without it, asking for one fails. A launch runs in a plain transaction until another domain supplies a bounded one.
 */
final class AgentsServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->scoped(AgentContext::class, fn () => throw AgentContextMissing::forRequest());
        $this->app->bindIf(LaunchTransaction::class, PlainLaunchTransaction::class);
        $this->app->singleton(LossTimes::class, fn () => new LossTimes(
            $this->app->make('config')->integer('agents.suspect_loss_after_seconds'),
            $this->app->make('config')->integer('agents.confirm_loss_after_seconds'),
        ));
    }
}
