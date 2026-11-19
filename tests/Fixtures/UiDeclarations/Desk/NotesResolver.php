<?php

declare(strict_types=1);

namespace Tests\Fixtures\UiDeclarations\Desk;

use App\Ui\Contracts\SectionResolver;
use App\Ui\Declarations\SlotContext;
use Tests\Fixtures\UiDeclarations\RecentNotesData;

final class NotesResolver implements SectionResolver
{
    public function read(SlotContext $context): RecentNotesData
    {
        return new RecentNotesData([$context->type->value]);
    }
}
