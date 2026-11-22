<?php

declare(strict_types=1);

namespace App\Support\Execution;

use App\Contracts\RunEvents;
use App\Contracts\StopSignal;
use App\Values\PartKey;

/**
 * What one supervised run tracks while it goes: where it reports, its stop signal, how many attempts each syntax
 * node has had, and the background parts still running under it.
 */
final class RunState
{
    /**
     * @var list<array{PartKey, SpawnedProcess}>
     */
    private array $background = [];

    /**
     * @var array<int, int>
     */
    private array $attempts = [];

    public function __construct(public readonly RunEvents $events, public readonly StopSignal $stop) {}

    /**
     * The next attempt number of a syntax node: an xargs or find -exec child runs it again under a new attempt.
     */
    public function nextAttempt(int $node): int
    {
        $this->attempts[$node] = ($this->attempts[$node] ?? 0) + 1;

        return $this->attempts[$node];
    }

    public function track(PartKey $part, SpawnedProcess $process): void
    {
        $this->background[] = [$part, $process];
    }

    /**
     * The background parts still to wait for, handed over once.
     *
     * @return list<array{PartKey, SpawnedProcess}>
     */
    public function takeBackground(): array
    {
        $background = $this->background;
        $this->background = [];

        return $background;
    }
}
