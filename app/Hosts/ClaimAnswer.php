<?php

declare(strict_types=1);

namespace App\Hosts;

use App\Projects\Values\ProjectReadClaim;
use App\Terminals\WatchedRuntime;
use App\Terminals\WatchedRuntimes;
use App\Values\ClaimedRequest;
use JsonSerializable;

/**
 * What a host's claim gets back: the requests it took, the runtimes watched on it and the version of that list.
 */
final readonly class ClaimAnswer implements JsonSerializable
{
    /**
     * @param  list<WatchedRuntime>  $watched
     */
    public function __construct(
        public HostClaim $claimed,
        public array $watched,
    ) {}

    /**
     * @return array{
     *     requests: list<ClaimedRequest>,
     *     project_reads: list<ProjectReadClaim>,
     *     watched: list<array{runtime_id: string, interval_ms: int}>,
     *     watched_version: int,
     * }
     */
    public function jsonSerialize(): array
    {
        return [
            'requests' => $this->claimed->requests->requests,
            'project_reads' => $this->claimed->projectReads->claims,
            'watched' => array_map(
                fn (WatchedRuntime $runtime) => [
                    'runtime_id' => $runtime->runtimeId,
                    'interval_ms' => $runtime->intervalMs,
                ],
                $this->watched,
            ),
            'watched_version' => WatchedRuntimes::versionOf($this->watched),
        ];
    }
}
