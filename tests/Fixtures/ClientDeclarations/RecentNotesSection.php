<?php

declare(strict_types=1);

namespace Tests\Fixtures\ClientDeclarations;

use App\Declarations\SlotContext;
use App\Navigation\Contracts\SectionResolver;

/**
 * An empty notes section.
 */
final class RecentNotesSection implements SectionResolver
{
    public function read(SlotContext $context): RecentNotesData
    {
        return RecentNotesData::build()->titles([])->finish();
    }
}
