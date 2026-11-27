<?php

declare(strict_types=1);

namespace App\Sessions\States\Values;

use Spatie\LaravelData\Data;

/**
 * What of a session runs: the processes its runtime was told to open that have not ended, and whether a stop was
 * asked. The session is over once a stop was asked and none of them runs. Its state alone holds it and changes it.
 */
final class SessionRun extends Data
{
    /**
     * @param  list<string>  $liveProcesses
     */
    public function __construct(
        public array $liveProcesses = [],
        public bool $isStopAsked = false,
    ) {}

    public function openProcess(string $processId): void
    {
        $this->liveProcesses = array_values(array_unique([...$this->liveProcesses, $processId]));
    }

    public function endProcess(string $processId): void
    {
        $this->liveProcesses = array_values(array_diff($this->liveProcesses, [$processId]));
    }

    public function askStop(): void
    {
        $this->isStopAsked = true;
    }

    public function isOver(): bool
    {
        return $this->isStopAsked && $this->liveProcesses === [];
    }
}
