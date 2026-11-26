<?php

declare(strict_types=1);

namespace App\Hosts\Commands\MarkSilentHosts;

use App\Bus\Contracts\CommandHandler;
use App\Models\Projects\Host;
use App\Time\Contracts\ServerClock;

/**
 * A silent host fails from the end of its 90 seconds on, the way a host whose calls fail is shown; its processes are left as
 * they are, and its next heartbeat ends the failure.
 */
final readonly class MarkSilentHostsHandler implements CommandHandler
{
    /**
     * How long a host's heartbeat may be silent before it is shown failing.
     */
    public const int SILENCE_SECONDS = 90;

    public const string ROUTE = '/host/heartbeat';

    public function __construct(private ServerClock $clock) {}

    public function handle(MarkSilentHostsCommand $command): void
    {
        $silentSince = $this->clock->now()->subSeconds(self::SILENCE_SECONDS);

        foreach (Host::findSilentSince($silentSince) as $host) {
            $host->recordCallFailure(self::ROUTE, 0, 'no heartbeat for 90 seconds', $silentSince);
        }
    }
}
