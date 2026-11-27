<?php

declare(strict_types=1);

namespace App\Sessions\States\Values;

use Spatie\LaravelData\Data;

/**
 * What of a session runs: the processes its runtime was told to open that have not ended, and whether a stop was
 * asked. The session is over once a stop was asked and none of them runs.
 */
final class SessionRun extends Data
{
    /**
     * @param  list<string>  $liveProcesses
     */
    public function __construct(
        public readonly array $liveProcesses,
        public readonly bool $isStopAsked,
    ) {}

    public static function started(): self
    {
        return new self([], false);
    }

    public function withOpened(string $processId): self
    {
        return new self(array_values(array_unique([...$this->liveProcesses, $processId])), $this->isStopAsked);
    }

    public function withEnded(string $processId): self
    {
        return new self(array_values(array_diff($this->liveProcesses, [$processId])), $this->isStopAsked);
    }

    public function withStopAsked(): self
    {
        return new self($this->liveProcesses, true);
    }

    public function isOver(): bool
    {
        return $this->isStopAsked && $this->liveProcesses === [];
    }
}
