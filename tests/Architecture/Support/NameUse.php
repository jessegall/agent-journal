<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

/**
 * One use of a fully resolved name in a file.
 */
final readonly class NameUse
{
    public function __construct(
        public string $file,
        public int $line,
        public string $name,
        public NameKind $kind,
    ) {}
}
