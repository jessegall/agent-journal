<?php

declare(strict_types=1);

namespace Domain\Documents\Api;

final readonly class RetainedDraftView
{
    public function __construct(
        public string $id,
        public string $documentId,
        public int $baseRevision,
        public string $body,
        public string $reason,
    ) {}
}
