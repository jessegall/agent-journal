<?php

declare(strict_types=1);

namespace Tests\Fixtures\UiDeclarations\Shelf;

use App\Core\Ui\Contracts\SectionReader;
use App\Core\Ui\Declarations\SlotContext;
use RuntimeException;
use Tests\Fixtures\UiDeclarations\RecentNotesData;

final class BrokenReader implements SectionReader
{
    public function read(SlotContext $context): RecentNotesData
    {
        throw new RuntimeException('The shelf database is gone.');
    }
}
