<?php

declare(strict_types=1);

namespace App\Sharing\Support;

use App\Records\Support\RecordIdentity;

/**
 * The safe metadata of one record a share may show: its identity, title and the version of it that is published.
 */
final readonly class ShareRecordCard
{
    public function __construct(
        public RecordIdentity $record,
        public string $title,
        public string $publicationVersion,
    ) {}
}
