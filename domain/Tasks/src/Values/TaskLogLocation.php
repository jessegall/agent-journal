<?php

declare(strict_types=1);

namespace Domain\Tasks\Values;

use App\Search\Values\RecordLocation;

/**
 * Where a log line sits in its task: the line's own id, which never changes, and the run and line the user reads.
 */
final readonly class TaskLogLocation
{
    public function __construct(
        public string $entryId,
        public int $runNumber,
        public int $sequence,
    ) {}

    public static function of(TaskLogLine $line): self
    {
        return new self($line->id, $line->runNumber, $line->sequence);
    }

    public function label(): string
    {
        return "Run {$this->runNumber}, line {$this->sequence}";
    }

    public function location(): RecordLocation
    {
        return new RecordLocation($this->entryId, $this->label());
    }
}
