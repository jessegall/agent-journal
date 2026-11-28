<?php

declare(strict_types=1);

namespace App\Http\Pages;

use App\Actors\Contracts\ActorLabels;
use App\Agents\Activity\Data\ActivityEventData;
use App\Agents\Activity\Data\ActivityWindowData;
use App\Hosts\Contracts\ServedEnvironment;
use App\Http\Requests\ActivityWindowRequest;
use App\Models\Agents\ActivityEntry;
use App\Reads\PageFormRequests;
use App\Support\ActorNames;
use App\Web\Creation\Contracts\PageBuilder;
use Illuminate\Http\Request;

/**
 * The Activity window's feed: the newest entries of the environment served, or, with before, the ones older than
 * that entry, sent oldest first with every level, since the window filters levels itself.
 */
final readonly class ActivityPageBuilder implements PageBuilder
{
    public function __construct(
        private ServedEnvironment $served,
        private PageFormRequests $requests,
        private ActorLabels $labels,
    ) {}

    public function build(Request $visit): ActivityWindowData
    {
        $input = $this->requests->from(ActivityWindowRequest::class, $visit);

        $environmentId = $this->served->environmentId();
        $before = $input->before();
        $cursor = $before === '' ? null : ActivityEntry::query()->whereKey($before)->firstOption()->getOrElse(null);

        $read = ActivityEntry::query()
            ->newestBefore($environmentId, $cursor)
            ->limit(ActivityEntry::READ_ENTRY_LIMIT + 1)
            ->get()
            ->all();

        $page = array_reverse(array_slice($read, 0, ActivityEntry::READ_ENTRY_LIMIT));
        $labels = $this->labels->labelsFor(array_map(fn (ActivityEntry $entry) => $entry->actor(), $page));

        return ActivityWindowData::build()
            ->hasOlder(count($read) > ActivityEntry::READ_ENTRY_LIMIT)
            ->events(array_map(fn (ActivityEntry $entry) => $this->event($entry, $labels), $page))
            ->finish();
    }

    private function event(ActivityEntry $entry, ActorNames $labels): ActivityEventData
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
