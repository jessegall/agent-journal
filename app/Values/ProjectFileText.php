<?php

declare(strict_types=1);

namespace App\Values;

/**
 * The text a host read from a project file, the sha256 digest of those bytes and the size of the whole file.
 */
final readonly class ProjectFileText
{
    public function __construct(
        public string $text,
        public string $digest,
        public int $size,
    ) {}
}
