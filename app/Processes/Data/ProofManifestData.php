<?php

declare(strict_types=1);

namespace App\Processes\Data;

use App\Processes\Values\ProofSample;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

/**
 * A shipped reader's proof manifest: the samples it was proven on, in order.
 */
final class ProofManifestData extends Data
{
    /**
     * @param  list<ProofSampleData>  $samples
     */
    public function __construct(
        #[DataCollectionOf(ProofSampleData::class)]
        public readonly array $samples,
    ) {}

    /**
     * @return list<ProofSample>
     */
    public function samples(): array
    {
        return array_map(fn (ProofSampleData $sample) => $sample->sample(), $this->samples);
    }
}
