<?php

declare(strict_types=1);

namespace App\Processes\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

/**
 * One command request as the owner reviews it (doc 21 revision 6, sections 51 and 71): its state and next step, the
 * proposals with every revision, the samples, the readers with their proofs and the exit statuses still without a
 * sample.
 */
final class RequestWindowData extends Data
{
    /**
     * @param  list<string>  $steps
     * @param  list<ProposalData>  $proposals
     * @param  list<SampleData>  $samples
     * @param  list<ReaderProofData>  $readers
     * @param  list<int>  $unsampledStatuses
     */
    public function __construct(
        public readonly RequestRowData $request,
        public readonly array $steps,
        #[DataCollectionOf(ProposalData::class)]
        public readonly array $proposals,
        #[DataCollectionOf(SampleData::class)]
        public readonly array $samples,
        #[DataCollectionOf(ReaderProofData::class)]
        public readonly array $readers,
        public readonly array $unsampledStatuses,
        public readonly int $activeRevision,
        public readonly string $lineDigest,
    ) {}
}
