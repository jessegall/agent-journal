<?php

declare(strict_types=1);

namespace App\Agents;

use App\Agents\Activity\Contracts\ActivityLog as ActivityLogContract;
use App\Agents\Enums\ActivityType;
use App\Events\Sessions\ActivityRecorded;
use App\Hosts\Contracts\ServedEnvironment;
use App\Models\Agents\ActivityEntry;
use App\Projects\Contracts\AgentProjects;
use App\Support\ActorReference;
use App\Values\ProjectOwner;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Writes what an agent did as an entry of the environment the request serves and of the agent's project, and tells
 * open pages once per entry.
 */
final readonly class ActivityLog implements ActivityLogContract
{
    public function __construct(
        private ServedEnvironment $served,
        private Dispatcher $events,
        private AgentProjects $agents,
    ) {}

    public function record(ActorReference $agent, ActivityType $type, string $subject): void
    {
        $entry = ActivityEntry::create(
            $agent,
            $type,
            $subject,
            $this->served->environmentId(),
            $this->ownerOf($agent),
        );

        $this->events->dispatch(new ActivityRecorded($entry->id));
    }

    /**
     * The acting agent's project; an entry of any other actor names none.
     */
    private function ownerOf(ActorReference $actor): ProjectOwner
    {
        if (! $actor->isAgent()) {
            return ProjectOwner::global();
        }

        return ProjectOwner::ofProject($this->agents->projectIdOf($actor->id));
    }
}
