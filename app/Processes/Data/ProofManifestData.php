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
     * @param  list<ProofSample>  $samples
     */
    public function __construct(
        #[DataCollectionOf(ProofSample::class)]
        public readonly array $samples,
    ) {}
}
