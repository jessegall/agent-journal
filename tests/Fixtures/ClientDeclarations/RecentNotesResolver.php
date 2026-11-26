<?php

declare(strict_types=1);

namespace Tests\Fixtures\ClientDeclarations;

use App\Declarations\SlotContext;
use App\Navigation\Contracts\PageResolver;
use App\Navigation\Contracts\SectionResolver;

/**
 * A reader that narrows its return type to a concrete Data class, as both a page and a section reader.
 */
final class RecentNotesResolver implements PageResolver, SectionResolver
{
    public function read(SlotContext|null $context = null): RecentNotesData
    {
        return new RecentNotesData([]);
    }
}
