<?php

declare(strict_types=1);

namespace App\Records\Calls;

use Spatie\LaravelData\Data;

/**
 * The two records a link change joined or parted, as they were named.
 */
final class LinkChanged extends Data
{
    public function __construct(
        public string $source,
        public string $target,
    ) {}
}
