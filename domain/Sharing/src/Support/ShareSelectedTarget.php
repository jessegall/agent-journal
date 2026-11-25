<?php

declare(strict_types=1);

namespace Domain\Sharing\Support;

use App\Support\RecordIdentity;
use Spatie\LaravelData\Data;

/**
 * One linked record the owner selected in a preview: the record, the link it was reached by and the version of it
 * that was published when the preview was saved.
 */
final class ShareSelectedTarget extends Data
{
    public function __construct(
        public readonly RecordIdentity $record,
        public readonly string $linkId,
        public readonly string $publicationVersion,
    ) {}
}
