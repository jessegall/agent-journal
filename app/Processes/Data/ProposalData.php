<?php

declare(strict_types=1);

namespace App\Processes\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

/**
 * One proposal answering the request: its state, author and every revision, newest first.
 */
final class ProposalData extends Data
{
    /**
     * @param  list<DeclarationData>  $revisions
     */
    public function __construct(
        public readonly string $id,
        public readonly string $state,
        public readonly int $currentRevision,
        public readonly string $author,
        #[DataCollectionOf(DeclarationData::class)]
        public readonly array $revisions,
    ) {}
}
