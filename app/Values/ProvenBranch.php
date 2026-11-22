<?php

declare(strict_types=1);

namespace App\Values;

use App\Contracts\Settings\StoredValue;
use App\Enums\Outcome;
use App\Support\Stored\StoredProvenBranch;

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

    public static function fromJson(string $json): self
    {
        return StoredProvenBranch::from(json_decode($json, true, flags: JSON_THROW_ON_ERROR))->branch();
    }

    public static function listFromJson(string $json): array
    {
        return array_values(array_map(
            fn (StoredProvenBranch $stored) => $stored->branch(),
            StoredProvenBranch::collect(json_decode($json, true, flags: JSON_THROW_ON_ERROR)),
        ));
    }
}
