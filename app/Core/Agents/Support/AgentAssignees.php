<?php

declare(strict_types=1);

namespace App\Core\Agents\Support;

use App\Core\Actors\Enums\ActorKind;
use App\Core\Actors\Support\ActorIdentity;
use App\Core\Agents\Exceptions\AgentNotAvailable;
use App\Core\Agents\Models\Agent;
use App\Core\Assignments\Contracts\AssigneeProvider;
use App\Core\Assignments\Exceptions\AssigneeUnavailable;
use App\Core\Assignments\Support\AssigneeList;
use App\Core\Assignments\Support\AssigneeName;
use App\Core\Assignments\Support\Page;
use App\Core\Contracts\Assignee;
use App\Core\Contracts\CurrentActor;

/**
 * Agents as holders of work: any agent that is not retired may receive work, whether or not it runs now, and every
 * signed-in actor may see agents' names, retired ones included, so earlier holders keep their name.
 */
final readonly class AgentAssignees implements AssigneeProvider
{
    public function __construct(
        private CurrentActor $actors,
        private AgentLifecycle $lifecycle,
    ) {}

    /**
     * @throws AssigneeUnavailable
     */
    public function requireEligible(ActorIdentity $recipient): Assignee
    {
        $this->actors->actor();

        if ($recipient->kind !== ActorKind::Agent) {
            throw AssigneeUnavailable::forActor($recipient);
        }

        try {
            return $this->lifecycle->lockShared($recipient->id);
        } catch (AgentNotAvailable $unavailable) {
            throw AssigneeUnavailable::forActor($recipient, $unavailable);
        }
    }

    /**
     * @param  list<ActorIdentity>  $actors
     * @return list<AssigneeName>
     */
    public function names(array $actors): array
    {
        $this->actors->actor();
        $ids = array_values(array_unique(array_map(fn (ActorIdentity $actor) => $actor->id, array_filter($actors, fn (ActorIdentity $actor) => $actor->kind === ActorKind::Agent))));

        return array_values(Agent::query()->whereKey($ids)->orderBy('id')->get()
            ->map(fn (Agent $agent) => new AssigneeName(ActorIdentity::of($agent), $agent->name))
            ->all());
    }

    public function eligible(Page $page): AssigneeList
    {
        $this->actors->actor();
        $agents = Agent::query()->whereNull('retired_at')
            ->when($page->afterId !== null, fn ($query) => $query->where('id', '>', $page->afterId))
            ->orderBy('id')
            ->limit($page->limit + 1)
            ->get();
        $shown = $agents->take($page->limit);

        return new AssigneeList(
            array_values($shown->map(fn (Agent $agent) => new AssigneeName(ActorIdentity::of($agent), $agent->name))->all()),
            $agents->count() > $page->limit ? $shown->last()?->id : null,
        );
    }
}
