<?php

declare(strict_types=1);

namespace Tests\Fixtures\UiDeclarations\Desk;

use App\Core\Ui\Contracts\SectionReader;
use App\Core\Ui\Declarations\SlotContext;
use Tests\Fixtures\UiDeclarations\RecentNotesData;

final class NotesReader implements SectionReader
{
    public function read(SlotContext $context): RecentNotesData
    {
        return new RecentNotesData([$context->type->value]);
    }
}
