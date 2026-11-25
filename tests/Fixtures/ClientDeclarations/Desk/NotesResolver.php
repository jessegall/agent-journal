<?php

declare(strict_types=1);

namespace Tests\Fixtures\ClientDeclarations\Desk;

use App\Contracts\Navigation\SectionResolver;
use App\Declarations\SlotContext;
use Tests\Fixtures\ClientDeclarations\RecentNotesData;

final class NotesResolver implements SectionResolver
{
    public function read(SlotContext $context): RecentNotesData
    {
        return new RecentNotesData([$context->type->value]);
    }
}
