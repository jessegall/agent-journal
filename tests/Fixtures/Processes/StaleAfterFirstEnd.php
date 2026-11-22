<?php

declare(strict_types=1);

namespace Tests\Fixtures\Processes;

use App\Contracts\RunEvents;
use App\Enums\OutputStream;
use App\Models\ProcessRun;
use App\Values\PartEnd;
use App\Values\PartKey;

/**
 * Records a run's events and retires its rules, as an owner would mid-run, as soon as its first part ended.
 */
final readonly class StaleAfterFirstEnd implements RunEvents
{
    public function __construct(private RunEvents $recorded, private ProcessRun $run, private string $reason) {}

    public function queued(PartKey $part): void
    {
        $this->recorded->queued($part);
    }

    public function started(PartKey $part, int $pid, string $host): void
    {
        $this->recorded->started($part, $pid, $host);
    }

    public function startedInside(PartKey $part, string $host): void
    {
        $this->recorded->startedInside($part, $host);
    }

    public function output(PartKey $part, OutputStream $stream, string $bytes): void
    {
        $this->recorded->output($part, $stream, $bytes);
    }

    public function ended(PartKey $part, PartEnd $end, bool $drained): void
    {
        $this->recorded->ended($part, $end, $drained);
        $this->run->markStale($this->reason);
    }

    public function skipped(PartKey $part, string $controllingResult): void
    {
        $this->recorded->skipped($part, $controllingResult);
    }

    public function spawnFailed(PartKey $part, string $reason): void
    {
        $this->recorded->spawnFailed($part, $reason);
    }

    public function stopped(PartKey $part, string $reason): void
    {
        $this->recorded->stopped($part, $reason);
    }

    public function lost(PartKey $part): void
    {
        $this->recorded->lost($part);
    }

    public function runStopped(string $reason): void
    {
        $this->recorded->runStopped($reason);
    }

    public function runFinished(int $rootStatus): void
    {
        $this->recorded->runFinished($rootStatus);
    }

    public function staleReason(PartKey $part): string
    {
        return $this->recorded->staleReason($part);
    }
}
