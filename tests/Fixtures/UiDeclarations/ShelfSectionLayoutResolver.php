<?php

declare(strict_types=1);

namespace Tests\Fixtures\UiDeclarations;

use App\Contracts\SectionResolver;
use App\Declarations\SlotContext;
use App\Support\Layout\DeclaredLayoutData;
use App\Support\Layout\LayoutPartData;

/**
 * A declared section's reader: one line of text.
 */
final readonly class ShelfSectionLayoutResolver implements SectionResolver
{
    public function read(SlotContext $context): DeclaredLayoutData
    {
        return DeclaredLayoutData::of(LayoutPartData::text('lent', 'Two books lent'));
    }
}
