<?php

declare(strict_types=1);

namespace App\Core\Hooks\Models;

use App\Core\Agents\AgentContext;
use App\Core\Contracts\CurrentActor;
use Illuminate\Container\Container;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

/**
 * For a model whose rows belong to one agent: every query sees only the calling agent's rows, and the journal's own
 * work on another agent's rows reads them through the explicit ownedBy query. A user reads them through the
 * explicit visibleToUser query, which route binding uses when the actor of the request is a user.
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

    /**
     * The read for the user acting in this request: every agent's rows the user may inspect. The user actor
     * exists only after the access policy let the user in; any other actor is refused.
     *
     * @param  Builder<static>  $query
     */
    #[Scope]
    protected function visibleToUser(Builder $query): void
    {
        Container::getInstance()->make(CurrentActor::class)->actor()->requireUser();

        $query->withoutGlobalScope(AgentScope::class);
    }

    /**
     * The read for whoever acts in this request: a user reads through visibleToUser, anyone else keeps the agent
     * scope, which still needs the agent context and fails without it.
     *
     * @param  Builder<static>  $query
     */
    #[Scope]
    protected function forActor(Builder $query): void
    {
        $actors = Container::getInstance()->make(CurrentActor::class);

        if ($actors->hasActor() && $actors->actor()->isUser()) {
            $query->visibleToUser();
        }
    }

    /**
     * Route binding reads through the actor's own scope: a user's route binds through visibleToUser, an agent's
     * through its own agent scope, and a request with no actor fails before any row is read.
     *
     * @param  mixed  $value
     * @param  string|null  $field
     */
    public function resolveRouteBinding($value, $field = null): Model|null
    {
        Container::getInstance()->make(CurrentActor::class)->actor();

        return $this->resolveRouteBindingQuery($this->newQuery()->forActor(), $value, $field)->first();
    }
}
