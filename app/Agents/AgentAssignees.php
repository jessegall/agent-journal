<?php

declare(strict_types=1);

namespace App\Agents;

use App\Actors\Contracts\CurrentActor;
use App\Assignments\Contracts\Assignee;
use App\Assignments\Contracts\AssigneeProvider;
use App\Exceptions\AssigneeUnavailable;
use App\Models\Agents\Agent;
use App\Sessions\Exceptions\AgentNotAvailable;
use App\Support\AssigneeIdentity;
use App\Support\CursorPage;
use App\Support\AssigneeName;
use App\Support\IdListPage;
use App\Support\Lifecycle\AgentLocks;

/**
 * Agents as holders of work: any agent that is not retired may receive work, whether or not it runs now, and every
 * signed-in actor may see agents' names, retired ones included, so earlier holders keep their name.
 */
final readonly class AgentAssignees implements AssigneeProvider
{
    public function __construct(
        private CurrentActor $actors,
        private AgentLocks $lifecycle,
    ) {}

    /**
     * @throws AssigneeUnavailable
     */
    public function requireEligible(AssigneeIdentity $recipient): Assignee
    {
        $this->actors->actor();

        try {
            return $this->lifecycle->lockShared($recipient->id);
        } catch (AgentNotAvailable $unavailable) {
            throw AssigneeUnavailable::forActor($recipient, $unavailable);
        }
    }

    /**
     * @throws AssigneeUnavailable
     */
    public function requireExclusive(AssigneeIdentity $recipient): Assignee
    {
        $this->actors->actor();

        try {
            return $this->lifecycle->lockExclusiveActive($recipient->id);
        } catch (AgentNotAvailable $unavailable) {
            throw AssigneeUnavailable::forActor($recipient, $unavailable);
        }
    }

    /**
     * @param  list<AssigneeIdentity>  $actors
     * @return list<AssigneeName>
     */
    public function names(array $actors): array
    {
        $this->actors->actor();
        $ids = array_values(array_unique(array_map(fn (AssigneeIdentity $actor) => $actor->id, $actors)));

        return array_values(Agent::query()->whereKey($ids)->oldestFirst()->get()
            ->map(fn (Agent $agent) => new AssigneeName(AssigneeIdentity::of($agent), $agent->name))
            ->all());
    }

    /** @return CursorPage<AssigneeName> */
    public function eligible(IdListPage $page): CursorPage
    {
        $this->actors->actor();

        $agents = Agent::query()->unretired()
            ->when($page->afterId !== null, fn ($query) => $query->where('id', '>', $page->afterId))
            ->oldestFirst()
            ->limit($page->limit + 1)
            ->get();

        $shown = $agents->take($page->limit);

        return new CursorPage(
            array_values(
                $shown->map(fn (Agent $agent) => new AssigneeName(AssigneeIdentity::of($agent), $agent->name))->all(),
            ),
            $agents->count() > $page->limit ? $shown->last()?->id : null,
        );
    }
}
