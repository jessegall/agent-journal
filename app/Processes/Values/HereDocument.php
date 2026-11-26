<?php

declare(strict_types=1);

namespace App\Processes\Values;

use App\Processes\Grammar\Values\SourceRange;

/**
 * A here-document: its delimiter, whether the delimiter was quoted (no expansion in the body), whether <<- strips
 * leading tabs, and where its body sits in the source.
 */
final readonly class HereDocument
{
    public function __construct(
        public string $delimiter,
        public bool $isQuoted,
        public bool $stripsTabs,
        public SourceRange $body,
    ) {}
}
