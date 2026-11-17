<?php

declare(strict_types=1);

namespace App\Core\Hooks\Models;

use App\Core\Agents\AgentContext;
use Illuminate\Container\Container;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;

/**
 * For a model whose rows belong to one agent: every query sees only the calling agent's rows, and the journal's own
 * work on another agent's rows reads them through the explicit ownedBy query.
 */
trait OwnedByOneAgent
{
    public static function bootOwnedByOneAgent(): void
    {
        static::addGlobalScope(new AgentScope(static fn (): AgentContext => Container::getInstance()->make(AgentContext::class)));
    }

    /**
     * The explicit read of one agent's rows, for the journal's own work on that agent; it lifts the current-agent limit.
     *
     * @param  Builder<static>  $query
     */
    #[Scope]
    protected function ownedBy(Builder $query, int $agentId): void
    {
        $query->withoutGlobalScope(AgentScope::class)->where($query->qualifyColumn('agent_id'), $agentId);
    }
}
