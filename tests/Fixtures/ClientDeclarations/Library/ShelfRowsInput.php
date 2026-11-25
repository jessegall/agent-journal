<?php

declare(strict_types=1);

namespace Tests\Fixtures\ClientDeclarations\Library;

use Spatie\LaravelData\Data;

/**
 * What a fixture loader of the library reads by: the shelf whose rows it gives.
 */
final class ShelfRowsInput extends Data
{
    public function __construct(public readonly string $shelfId) {}
}
