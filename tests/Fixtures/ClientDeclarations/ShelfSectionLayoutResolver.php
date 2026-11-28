<?php

declare(strict_types=1);

namespace Tests\Fixtures\ClientDeclarations;

use App\Declarations\SlotContext;
use App\Navigation\Contracts\SectionResolver;
use App\Support\Layout\DeclaredLayoutData;
use App\Support\Layout\LayoutPartData;

/**
 * A declared section's reader: one line of text.
 */
final readonly class ShelfSectionLayoutResolver implements SectionResolver
{
    public function read(SlotContext $context): DeclaredLayoutData
    {
        return DeclaredLayoutData::build()
            ->root(LayoutPartData::build()->asText()->key('lent')->value('Two books lent')->finish())
            ->finish();
    }
}
