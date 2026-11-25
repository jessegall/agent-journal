<?php

declare(strict_types=1);

namespace Tests\Fixtures\ClientDeclarations\Shelf;

use App\Contracts\Navigation\SectionResolver;
use App\Declarations\SlotContext;
use Tests\Fixtures\ClientDeclarations\RecentNotesData;

/**
 * A section on a record slot that shows the id of the record it was handed.
 */
final class RecordNotesResolver implements SectionResolver
{
    public function read(SlotContext $context): RecentNotesData
    {
        return new RecentNotesData([(string) $context->id]);
    }
}
