<?php

declare(strict_types=1);

namespace App\Resolvers;

use App\Contracts\Actors\ActorLabels;
use App\Contracts\Hosts\ServedEnvironment;
use App\Contracts\Navigation\PageResolver;
use App\Data\Activity\ActivityEventData;
use App\Data\Activity\ActivityWindowData;
use App\Http\Requests\ActivityWindowRequest;
use App\Models\Agents\ActivityEntry;
use App\Support\ActorLabelSet;

/**
 * The Activity window's feed: the newest entries of the environment served, or, with before, the ones older than
 * that entry, sent oldest first with every level, since the window filters levels itself.
 */
final readonly class ActivityWindowResolver implements PageResolver
{
    public function __construct(
        private ServedEnvironment $served,
        private ActivityWindowRequest $request,
        private ActorLabels $labels,
    ) {}

    public function read(): ActivityWindowData
    {
        $environmentId = $this->served->environmentId();
        $before = $this->request->before();
        $cursor = $before === '' ? null : ActivityEntry::query()->whereKey($before)->firstOption()->getOrElse(null);

        $read = ActivityEntry::query()
            ->newestBefore($environmentId, $cursor)
            ->readUpTo(ActivityEntry::READ_ENTRY_LIMIT + 1)
            ->get()
            ->all();

        $page = array_reverse(array_slice($read, 0, ActivityEntry::READ_ENTRY_LIMIT));
        $labels = $this->labels->labelsFor(array_map(fn (ActivityEntry $entry) => $entry->actor(), $page));

        return ActivityWindowData::from([
            'events' => array_map(fn (ActivityEntry $entry) => $this->event($entry, $labels), $page),
            'hasOlder' => count($read) > ActivityEntry::READ_ENTRY_LIMIT,
        ]);
    }

    private function event(ActivityEntry $entry, ActorLabelSet $labels): ActivityEventData
    {
        return ActivityEventData::from([
            'id' => $entry->id,
            'occurredAt' => $entry->occurred_at->toIso8601String(),
            'level' => $entry->level->value,
            'icon' => $entry->type->icon(),
            'who' => $labels->nameOf($entry->actor()) ?? '',
            'text' => "{$entry->type->verb()} {$entry->subject}",
            'found' => $entry->found ?? [],
        ]);
    }
}
