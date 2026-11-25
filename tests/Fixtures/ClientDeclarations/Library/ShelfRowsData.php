<?php

declare(strict_types=1);

namespace Tests\Fixtures\ClientDeclarations\Library;

use Spatie\LaravelData\Data;

/**
 * What a fixture loader of the library answers: the titles on a shelf.
 */
final class ShelfRowsData extends Data
{
    /**
     * @param  list<string>  $titles
     */
    public function __construct(public readonly array $titles) {}
}
