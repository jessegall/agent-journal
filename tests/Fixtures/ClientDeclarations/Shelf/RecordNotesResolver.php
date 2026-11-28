<?php

declare(strict_types=1);

namespace Tests\Fixtures\ClientDeclarations\Shelf;

use App\Declarations\SlotContext;
use App\Navigation\Contracts\SectionResolver;
use Tests\Fixtures\ClientDeclarations\RecentNotesData;

/**
 * A section on a record slot that shows the id of the record it was handed.
 */
final class RecordNotesResolver implements SectionResolver
{
    public function read(SlotContext $context): RecentNotesData
    {
        return RecentNotesData::build()->titles([(string) $context->id])->finish();
    }
}
