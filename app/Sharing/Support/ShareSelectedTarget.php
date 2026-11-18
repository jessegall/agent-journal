<?php

declare(strict_types=1);

namespace App\Sharing\Support;

use App\Records\Support\RecordIdentity;

/**
 * One linked record the owner selected in a preview: the record, the link it was reached by and the version of it
 * that was published when the preview was saved.
 */
final readonly class ShareSelectedTarget
{
    public function __construct(
        public RecordIdentity $record,
        public string $linkId,
        public string $publicationVersion,
    ) {}
}
