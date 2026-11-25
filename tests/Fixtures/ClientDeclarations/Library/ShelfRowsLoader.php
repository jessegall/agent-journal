<?php

declare(strict_types=1);

namespace Tests\Fixtures\ClientDeclarations\Library;

/**
 * A fixture loader of the right shape: one library input in, one library answer out.
 */
final readonly class ShelfRowsLoader
{
    public function __invoke(ShelfRowsInput $input): ShelfRowsData
    {
        return ShelfRowsData::from(['titles' => [$input->shelfId]]);
    }
}
