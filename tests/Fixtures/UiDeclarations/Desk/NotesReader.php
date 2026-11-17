<?php

declare(strict_types=1);

namespace Tests\Fixtures\UiDeclarations\Desk;

use App\Domain\Contracts\SectionReader;
use App\Domain\Declarations\SlotContext;
use Tests\Fixtures\UiDeclarations\RecentNotesData;

final class NotesReader implements SectionReader
{
    public function read(SlotContext $context): RecentNotesData
    {
        return new RecentNotesData([$context->kind->value]);
    }
}
