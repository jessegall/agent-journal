<?php

declare(strict_types=1);

namespace App\Api\Processes;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

/**
 * The proposals an import made or found again.
 */
final class ProposalsImported extends Data
{
    /**
     * @param  list<ProposalReceived>  $proposals
     */
    public function __construct(
        #[DataCollectionOf(ProposalReceived::class)]
        public readonly array $proposals,
    ) {}
}
