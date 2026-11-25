<?php

declare(strict_types=1);

namespace App\Support;

use App\Models\Projects\Host;
use Carbon\CarbonImmutable;

/**
 * The hosts whose link to the journal is broken, each as the sentence every page shows until it heals by itself: a
 * host whose calls the journal has failed for a minute, and the installation's own contained host when it has not
 * called for two. A connected project's host may go quiet when its machine sleeps, so only its failures show.
 */
final readonly class HostLinkAlarms
{
    /**
     * The most hosts a page names, the oldest failure first.
     */
    private const int HOST_LIMIT = 10;

    /**
     * @return list<string>
     */
    public function current(): array
    {
        $now = CarbonImmutable::now();
        $failingSince = $now->subMinute();
        $quietSince = $now->subMinutes(2);

        return array_values(Host::query()
            ->unrevoked()
            ->failingOrQuiet($failingSince, $quietSince)
            ->byFailingSince()
            ->limit(self::HOST_LIMIT)
            ->get()
            ->map(fn (Host $host): string => $host->linkAlarm)
            ->all());
    }
}
