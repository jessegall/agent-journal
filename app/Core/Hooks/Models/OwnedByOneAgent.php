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
 * work on another agent's rows reads them through the explicit ownedBy query. A person reads them through the
 * explicit visibleToPerson query, which route binding uses when the actor of the request is a person.
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
     * The read for the person acting in this request: every agent's rows the person may inspect. The person actor
     * exists only after the access policy let the person in; any other actor is refused.
     *
     * @param  Builder<static>  $query
     */
    #[Scope]
    protected function visibleToPerson(Builder $query): void
    {
        Container::getInstance()->make(CurrentActor::class)->actor()->requirePerson();

        $query->withoutGlobalScope(AgentScope::class);
    }

    /**
     * The read for whoever acts in this request: a person reads through visibleToPerson, anyone else keeps the agent
     * scope, which still needs the agent context and fails without it.
     *
     * @param  Builder<static>  $query
     */
    #[Scope]
    protected function forActor(Builder $query): void
    {
        $actors = Container::getInstance()->make(CurrentActor::class);

        if ($actors->hasActor() && $actors->actor()->isPerson()) {
            $query->visibleToPerson();
        }
    }

    /**
     * Route binding reads through the actor's own scope: a person's route binds through visibleToPerson, an agent's
     * through its own agent scope, and a request with no actor fails before any row is read.
     *
     * @param  mixed  $value
     * @param  string|null  $field
     */
    public function resolveRouteBinding($value, $field = null): ?Model
    {
        Container::getInstance()->make(CurrentActor::class)->actor();

        return $this->resolveRouteBindingQuery($this->newQuery()->forActor(), $value, $field)->first();
    }
}
