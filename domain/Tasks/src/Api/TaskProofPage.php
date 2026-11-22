<?php

declare(strict_types=1);

namespace Domain\Tasks\Api;

/**
 * One page of a task's proofs, newest first, and the proof to read after for the next page while older ones remain.
 */
final readonly class TaskProofPage
{
    /**
     * @param  list<TaskProof>  $proofs
     */
    public function __construct(
        public array $proofs,
        public string|null $nextAfter,
    ) {}
}
