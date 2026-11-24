<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Actors\CurrentActor;
use App\Contracts\Assignments\Assignee;
use App\Contracts\Assignments\AssigneeProvider;
use App\Exceptions\AgentNotAvailable;
use App\Exceptions\AssigneeUnavailable;
use App\Models\Agents\Agent;
use App\Support\Lifecycle\AgentLifecycle;

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

        return array_values(Agent::query()->whereKey($ids)->readExactly(count($ids))->orderBy('id')->get()
            ->map(fn (Agent $agent) => new AssigneeName(AssigneeIdentity::of($agent), $agent->name))
            ->all());
    }

    public function eligible(IdListPage $page): AssigneeList
    {
        $this->actors->actor();

        $agents = Agent::query()->whereNull('retired_at')
            ->when($page->afterId !== null, fn ($query) => $query->where('id', '>', $page->afterId))
            ->orderBy('id')
            ->limit($page->limit + 1)
            ->get();

        $shown = $agents->take($page->limit);

        return new AssigneeList(
            array_values(
                $shown->map(fn (Agent $agent) => new AssigneeName(AssigneeIdentity::of($agent), $agent->name))->all(),
            ),
            $agents->count() > $page->limit ? $shown->last()?->id : null,
        );
    }
}
