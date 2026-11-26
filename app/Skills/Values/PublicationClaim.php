<?php

declare(strict_types=1);

namespace App\Skills\Values;

/**
 * A publication a worker claimed, with the fencing version its later steps must name.
 */
final readonly class PublicationClaim
{
    public function __construct(
        public string $publicationId,
        public int $fence,
        public int $files,
    ) {}
}
