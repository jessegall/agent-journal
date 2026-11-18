<?php

declare(strict_types=1);

namespace App\Processes\Values;

use App\Processes\Contracts\StoredValue;
use App\Processes\Enums\Outcome;

/**
 * One exit branch a reader proof covers: the real sample run and part that ended with its status, the branch's
 * outcome, and the digest of each stream's chunk manifest the reader was replayed over.
 */
final readonly class ProvenBranch implements StoredValue
{
    /**
     * @param  array<string, string>  $manifests  stream => digest of its chunk checksums in offset order
     */
    public function __construct(
        public int $status,
        public Outcome $outcome,
        public string $processRunId,
        public string $partRunId,
        public array $manifests,
    ) {}

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'status' => $this->status,
            'outcome' => $this->outcome->value,
            'process_run_id' => $this->processRunId,
            'part_run_id' => $this->partRunId,
            'manifests' => $this->manifests,
        ];
    }

    /**
     * @param  array<string, mixed>  $fields  the shape toArray writes
     */
    public static function fromArray(array $fields): self
    {
        return new self(
            $fields['status'],
            Outcome::from($fields['outcome']),
            $fields['process_run_id'],
            $fields['part_run_id'],
            $fields['manifests'],
        );
    }
}
