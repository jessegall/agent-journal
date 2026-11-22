<?php

declare(strict_types=1);

namespace App\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * Where a paged list stands: the page shown, the last page and how many rows match.
 */
#[TypeScript]
final class PaginationData extends Data
{
    public function __construct(
        public readonly int $page,
        public readonly int $lastPage,
        public readonly int $total,
    ) {}
}
