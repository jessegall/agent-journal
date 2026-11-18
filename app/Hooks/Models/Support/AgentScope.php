<?php

declare(strict_types=1);

namespace App\Hooks\Models\Support;

use App\Actors\Contracts\CurrentActor;
use App\Agents\Support\AgentContext;
use Closure;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

/**
 * Limits a model to the rows of the current request's agent, in any of its sessions; the system acting sees none. It
 * asks for the context on every query, so a worker that serves many requests never keeps an earlier request's agent.
 *
 * @implements Scope<Model>
 */
final readonly class AgentScope implements Scope
{
    /**
     * @param  Closure(): CurrentActor  $actors
     * @param  Closure(): AgentContext  $currentContext
     */
    public function __construct(private Closure $actors, private Closure $currentContext) {}

    /**
     * @param  Builder<covariant Model>  $builder
     */
    public function apply(Builder $builder, Model $model): void
    {
        if (($this->actors)()->isSystem()) {
            $builder->whereKey([]);

            return;
        }

        $builder->where($model->qualifyColumn('agent_id'), ($this->currentContext)()->agentId);
    }
}
