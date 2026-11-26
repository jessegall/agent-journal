<?php

declare(strict_types=1);

namespace App\CommandRules\Values;

/**
 * What a project owner approves with: the proposal revision and the active rule revision they reviewed, the reader and
 * proof for a test, check or build (one, or none for any other purpose), and their reason.
 */
final readonly class OwnerApproval
{
    /**
     * @param  list<ReaderApproval>  $readers
     */
    public function __construct(
        public int $expectedRevision,
        public int $expectedActiveRevision,
        public array $readers,
        public string $reason,
    ) {}
}
