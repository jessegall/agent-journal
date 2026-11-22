<?php

declare(strict_types=1);

namespace App\Support;

/**
 * A saved preview the owner confirms a share with: its id and checksum, and the candidates it was chosen from.
 */
final readonly class SavedSharePreview
{
    public function __construct(
        public string $previewId,
        public string $checksum,
        public ShareCandidates $candidates,
    ) {}
}
