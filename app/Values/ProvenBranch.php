<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\CommandRules\Outcome;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * One exit branch a reader proof covers: the real sample run and part that ended with its status, the branch's
 * outcome, and the digest of each stream's chunk manifest the reader was replayed over.
 */
#[MapName(SnakeCaseMapper::class)]
final class ProvenBranch extends Data
{
    /**
     * @param  array<string, string>  $manifests  stream => digest of its chunk checksums in offset order
     */
    public function __construct(
        public readonly int $status,
        public readonly Outcome $outcome,
        public readonly string $processRunId,
        public readonly string $partRunId,
        public readonly array $manifests,
    ) {}

}
