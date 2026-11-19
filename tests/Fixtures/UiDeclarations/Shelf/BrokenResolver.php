<?php

declare(strict_types=1);

namespace Tests\Fixtures\UiDeclarations\Shelf;

use App\Ui\Contracts\SectionResolver;
use App\Ui\Declarations\SlotContext;
use RuntimeException;
use Tests\Fixtures\UiDeclarations\RecentNotesData;

final class BrokenResolver implements SectionResolver
{
    public function read(SlotContext $context): RecentNotesData
    {
        throw new RuntimeException('The shelf database is gone.');
    }
}
