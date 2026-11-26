<?php

declare(strict_types=1);

namespace App\Api\Processes;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;

/**
 * The draft reader revision a proposal made.
 */
final class ReaderProposed extends Data
{
    public function __construct(
        #[MapName('reader_revision_id')]
        public string $readerRevisionId,
        public string $state,
    ) {}
}
