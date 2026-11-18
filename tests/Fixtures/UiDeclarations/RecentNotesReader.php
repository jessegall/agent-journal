<?php

declare(strict_types=1);

namespace Tests\Fixtures\UiDeclarations;

use App\Ui\Contracts\PageReader;
use App\Ui\Contracts\SectionReader;
use App\Ui\Declarations\SlotContext;

/**
 * A reader that narrows its return type to a concrete Data class, as both a page and a section reader.
 */
final class RecentNotesReader implements PageReader, SectionReader
{
    public function read(SlotContext|null $context = null): RecentNotesData
    {
        return new RecentNotesData([]);
    }
}
