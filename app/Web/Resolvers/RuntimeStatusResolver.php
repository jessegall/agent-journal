<?php

declare(strict_types=1);

namespace App\Web\Resolvers;

use App\Agents\Contracts\RuntimeResolver;
use App\Agents\Data\RuntimeStatus;
use App\Agents\Enums\DriverVariant;
use App\Ui\Contracts\PageResolver;
use App\Ui\Layout\DeclaredLayoutData;
use App\Ui\Layout\LayoutActionData;
use App\Ui\Layout\LayoutNativeData;
use App\Ui\Layout\LayoutPartData;
use App\Web\Data\RecoveryRefusalPartData;
use App\Web\Data\RuntimeEntryData;

/**
 * The runtime status as summary cards: each agent runtime's driver, activity, hold, how fresh its observation is, who
 * watches it and, for a terminal runtime, a link to its live terminal, all as shared parts; under them, natively, the
 * owner's recovery controls, its settings and its latest requests. A refused recovery shows above the runtimes, and
 * with none running the page says so.
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

        if ($status->variant === DriverVariant::Terminal) {
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
