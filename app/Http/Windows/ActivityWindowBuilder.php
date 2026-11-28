<?php

declare(strict_types=1);

namespace App\Http\Windows;

use App\Agents\Activity\Data\ActivityPaneData;
use App\Hosts\Contracts\ServedEnvironment;
use App\Models\Agents\ActivityEntry;
use App\Support\Layout\LayoutRowData;
use App\Web\Creation\Contracts\WindowBuilder;
use App\Web\Creation\SurfaceAttributeMap;
use App\Web\Values\PaneExcerpt;
use Illuminate\Http\Request;

final readonly class ActivityWindowBuilder implements WindowBuilder
{
    public function __construct(private ServedEnvironment $served, private SurfaceAttributeMap $policies) {}

    public function build(Request $visit): ActivityPaneData
    {
        $policy = $this->policies->forType(ActivityPaneData::class);

        $entries = ActivityEntry::query()
            ->newestBefore($this->served->environmentId(), null)
            ->limit($policy->limitFor('items'))
            ->get(['id', 'occurred_at', 'type', 'subject']);

        $items = array_values($entries->map(fn (ActivityEntry $entry) => LayoutRowData::build()
            ->key($entry->id)
            ->label(PaneExcerpt::of("{$entry->type->verb()} {$entry->subject}"))
            ->detail($entry->occurred_at->toIso8601String())
            ->finish())->all());

        return ActivityPaneData::build()
            ->items($items)
            ->fullUrl(route('web.activity', absolute: false))
            ->finish();
    }
}
