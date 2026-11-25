<?php

declare(strict_types=1);

namespace Domain\Documents\Api;

use Domain\Documents\Data\RevisionCard;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

/**
 * One page of a document's revisions.
 */
final class RevisionList extends Data
{
    /**
     * @param  list<RevisionCard>  $revisions
     */
    public function __construct(
        #[DataCollectionOf(RevisionCard::class)]
        public array $revisions,
    ) {}
}
