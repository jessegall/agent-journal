<?php

declare(strict_types=1);

namespace Tests\Fixtures\UiDeclarations;

use App\Ui\Contracts\SectionResolver;
use App\Ui\Declarations\SlotContext;
use App\Ui\Layout\DeclaredLayoutData;
use App\Ui\Layout\LayoutPartData;

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
