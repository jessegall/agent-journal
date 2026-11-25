<?php

declare(strict_types=1);

namespace Tests\Fixtures\ClientDeclarations\Library;

use Tests\Fixtures\ClientDeclarations\RecentNotesData;

/**
 * A fixture loader that answers with a Data the library does not declare among its types.
 */
final readonly class BorrowedAnswerLoader
{
    public function __invoke(ShelfRowsInput $input): RecentNotesData
    {
        return RecentNotesData::from(['titles' => [$input->shelfId]]);
    }
}
