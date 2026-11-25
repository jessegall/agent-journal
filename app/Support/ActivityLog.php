<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Activity\ActivityLog as ActivityLogContract;
use App\Contracts\Hosts\ServedEnvironment;
use App\Enums\Agents\ActivityType;
use App\Events\Sessions\ActivityRecorded;
use App\Models\Agents\ActivityEntry;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Writes what an agent did as an entry of the environment the request serves, and tells open pages once per entry.
 */
final readonly class ActivityLog implements ActivityLogContract
{
    public function __construct(
        private ServedEnvironment $served,
        private Dispatcher $events,
    ) {}

    public function record(ActorIdentity $agent, ActivityType $type, string $subject): void
    {
        $entry = ActivityEntry::create($agent, $type, $subject, $this->served->environmentId());

        $this->events->dispatch(new ActivityRecorded($entry->id));
    }
}
