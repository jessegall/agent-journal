<?php

declare(strict_types=1);

namespace App\Support\Stored;

use App\Enums\Outcome;
use App\Values\ProvenBranch;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * A proven branch as it is stored, the shape ProvenBranch::toArray writes: the exit status, its outcome, the run
 * and part it was proven on and the digest of each stream's chunk manifest.
 *
 * @method static array<int, static> collect(mixed $items) read only from decoded JSON, so always an array
 */
#[MapInputName(SnakeCaseMapper::class)]
final class StoredProvenBranch extends Data
{
    /**
     * @param  array<string, string>  $manifests
     */
    public function __construct(
        public readonly int $status,
        public readonly Outcome $outcome,
        public readonly string $processRunId,
        public readonly string $partRunId,
        public readonly array $manifests,
    ) {}

    public function branch(): ProvenBranch
    {
        return new ProvenBranch($this->status, $this->outcome, $this->processRunId, $this->partRunId, $this->manifests);
    }
}
