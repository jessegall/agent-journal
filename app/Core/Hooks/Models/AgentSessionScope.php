<?php

declare(strict_types=1);

namespace App\Core\Hooks\Models;

use App\Core\Agents\AgentContext;
use Closure;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

/**
 * Limits a Hooks model to the agent and session of the current request. It asks for the context on every query,
 * so a worker that serves many requests never keeps an earlier request's agent.
 *
 * @implements Scope<Model>
 */
final readonly class AgentSessionScope implements Scope
{
    /**
     * @param  Closure(): AgentContext  $currentContext
     */
    public function __construct(private Closure $currentContext) {}

    /**
     * @param  Builder<covariant Model>  $builder
     */
    public function apply(Builder $builder, Model $model): void
    {
        $context = ($this->currentContext)();

        $builder->where($model->qualifyColumn('agent_id'), $context->agentId)
            ->where($model->qualifyColumn('session_id'), $context->sessionId);
    }
}
