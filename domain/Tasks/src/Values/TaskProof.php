<?php

declare(strict_types=1);

namespace Domain\Tasks\Values;

use Carbon\CarbonImmutable;

/**
 * One check of a task run as its proofs list it: what was checked, the run it checks, who asked for it, the process
 * run it was bound to, and, once the run's result was published, the receipt, its outcome and when it was bound.
 */
final readonly class TaskProof
{
    public function __construct(
        public string $id,
        public string $operation,
        public int $runNumber,
        public string $producerType,
        public string $producerId,
        public string $processRunId,
        public string|null $receiptId,
        public string|null $outcome,
        public CarbonImmutable $registeredAt,
        public CarbonImmutable|null $boundAt,
    ) {}
}
