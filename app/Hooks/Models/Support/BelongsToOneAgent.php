<?php

declare(strict_types=1);

namespace App\Hooks\Models\Support;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Models\Support\ReadsForActor;
use App\Agents\Support\AgentContext;
use Illuminate\Container\Container;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

/**
 * For a model whose rows belong to one agent: every query sees only the calling agent's rows, and the journal's own
 * work on another agent's rows reads them through the explicit ownedBy query. A user reads them through the
 * explicit visibleToUser query, which route binding uses when the actor of the request is a user.
 */
trait BelongsToOneAgent
{
    use ReadsForActor;

    public static function bootBelongsToOneAgent(): void
    {
        static::addGlobalScope(new AgentScope(
            static fn (): CurrentActor => Container::getInstance()->make(CurrentActor::class),
            static fn (): AgentContext => Container::getInstance()->make(AgentContext::class),
        ));
    }

    /**
     * The explicit read of one agent's rows, for the journal's own work on that agent; it lifts the current-agent limit.
     *
     * @param  Builder<static>  $query
     */
    #[Scope]
    protected function ownedBy(Builder $query, string $agentId): void
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
     * The row locked for a change that must happen once, among the actor's own rows or the rows no agent holds yet,
     * such as a message nobody was asked to answer or a run nobody follows; null when the actor may not have it.
     */
    public static function lockedForActorOrUnheld(string $id): static|null
    {
        return static::query()->forActor()->whereKey($id)->lockForUpdate()->first()
            ?? static::query()->withoutGlobalScope(AgentScope::class)->whereNull('agent_id')->whereKey($id)->lockForUpdate()->first();
    }
}
