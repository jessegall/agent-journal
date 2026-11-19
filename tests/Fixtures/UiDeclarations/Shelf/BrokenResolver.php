<?php

declare(strict_types=1);

namespace Tests\Fixtures\UiDeclarations\Shelf;

use App\Ui\Contracts\SectionResolver;
use App\Ui\Declarations\SlotContext;
use Tests\Fixtures\UiDeclarations\RecentNotesData;
use Tests\Support\Exceptions\SimulatedFailure;

final class BrokenResolver implements SectionResolver
{
    public function read(SlotContext $context): RecentNotesData
    {
        throw SimulatedFailure::of('The shelf database is gone.');
    }
}
