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

    public function __construct(private PublishedReleases $releases) {}

    /**
     * The hosts whose link fails or went quiet, then the hosts that run another release than the journal's.
     *
     * @return list<string>
     */
    public function current(): array
    {
        return [...$this->brokenLinks(), ...$this->outOfDateHosts()];
    }

    /**
     * @return list<string>
     */
    private function brokenLinks(): array
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
            ->map(fn (Host $host): string => $host->link_alarm)
            ->all());
    }

    /**
     * The hosts on another release than the journal's; none while the journal publishes no release.
     *
     * @return list<string>
     */
    private function outOfDateHosts(): array
    {
        if (! $this->releases->hasCompatibleRelease()) {
            return [];
        }

        $release = $this->releases->current()->version;

        return array_values(Host::query()
            ->unrevoked()
            ->runningAnotherReleaseThan($release)
            ->limit(self::HOST_LIMIT)
            ->get()
            ->map(fn (Host $host) => $host->releaseAlarm($release))
            ->all());
    }
}
