<?php

declare(strict_types=1);

namespace Tests\Fixtures\ClientDeclarations\Library;

/**
 * A fixture loader of the wrong shape: it takes no input Data.
 */
final readonly class InputlessLoader
{
    public function __invoke(): ShelfRowsData
    {
        return ShelfRowsData::from(['titles' => []]);
    }
}
