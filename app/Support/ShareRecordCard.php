<?php

declare(strict_types=1);

namespace App\Support;

/**
 * The safe metadata of one record a share may show: its identity, title and the version of it that is published;
 * an owned child such as a comment also carries a bounded excerpt and the selection it quotes, when it quotes one.
 */
final readonly class ShareRecordCard
{
    public const string QUOTE_NOT_IN_VERSION = 'Selection no longer in this version';

    public function __construct(
        public RecordIdentity $record,
        public string $title,
        public string $publicationVersion,
        public string|null $excerpt = null,
        public string|null $quote = null,
    ) {}
}
