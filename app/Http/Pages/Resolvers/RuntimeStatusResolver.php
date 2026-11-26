<?php

declare(strict_types=1);

namespace App\Http\Pages\Resolvers;

use App\Navigation\Contracts\PageResolver;
use App\Processes\Data\RecoveryRefusalPartData;
use App\Processes\Data\RuntimeEntryData;
use App\Processes\Data\RuntimeStatus;
use App\Sessions\Contracts\RuntimeResolver;
use App\Support\Layout\DeclaredLayoutData;
use App\Support\Layout\LayoutActionData;
use App\Support\Layout\LayoutNativeData;
use App\Support\Layout\LayoutPartData;

/**
 * The runtime status as summary cards: each runtime's driver, activity, hold, freshness, watchers and a terminal
 * runtime's live link, and under them the owner's recovery controls, settings and latest requests. A refused recovery
 * shows above the runtimes; with none running the page says so.
 */
final readonly class RuntimeStatusResolver implements PageResolver
{
    private const int RUNTIMES = 50;

    private const int REQUESTS_EACH = 20;

    public function __construct(private RuntimeResolver $runtimes) {}

    public function read(): DeclaredLayoutData
    {
        $runtimeEntries = array_map(fn (RuntimeStatus $status) => RuntimeEntryData::from([
            'status' => $status,
            'requests' => $this->runtimes->requestsOf($status->sessionId, self::REQUESTS_EACH),
        ]), $this->runtimes->page(1, self::RUNTIMES));

        $parts = [
            LayoutPartData::box('header', 'header', LayoutPartData::text('title', 'Runtimes', 'heading')),
            LayoutPartData::native(
                'refusal',
                LayoutNativeData::of('web/RuntimeRefusal', RecoveryRefusalPartData::from(['errorKey' => 'review'])),
            ),
        ];

        if ($runtimeEntries === []) {
            $parts[] = LayoutPartData::notice('empty', 'empty', 'No active runtimes.');
        }

        foreach ($runtimeEntries as $entry) {
            $parts[] = $this->cardOf($entry);
        }

        return DeclaredLayoutData::of(LayoutPartData::box('runtimes', 'stack', ...$parts));
    }

    private function cardOf(RuntimeEntryData $entry): LayoutPartData
    {
        $status = $entry->status;

        $age = $status->observationAgeSeconds === null
            ? 'never observed'
            : "observed {$status->observationAgeSeconds}s ago";

        $summary = [
            LayoutPartData::text('driver', $status->driver, 'code'),
            LayoutPartData::text('activity', $status->activity->value),
            LayoutPartData::text('hold', "hold: {$status->hold->value}", 'muted'),
            $status->isStale ? LayoutPartData::badge('observed', "{$age}, stale", 'warn') : LayoutPartData::text(
                'observed',
                $age,
                'muted',
            ),
        ];

        if ($status->hasScreen) {
            $terminal = LayoutActionData::to(route('web.terminal', ['agent' => $status->agentId], false));
            $summary[] = LayoutPartData::action('terminal', 'Watch terminal', $terminal, 'ghost');
        }

        if ($status->watchers > 0) {
            $summary[] = LayoutPartData::text('watchers', "{$status->watchers} watching", 'muted');
        }

        return LayoutPartData::box(
            $status->runtimeId,
            'card',
            LayoutPartData::box('summary', 'row', ...$summary),
            LayoutPartData::native('live', LayoutNativeData::of('web/RuntimeCard', $entry)),
        );
    }
}
