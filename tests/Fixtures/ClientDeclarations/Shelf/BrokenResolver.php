<?php

declare(strict_types=1);

namespace Tests\Fixtures\ClientDeclarations\Shelf;

use App\Contracts\Navigation\SectionResolver;
use App\Declarations\SlotContext;
use Tests\Fixtures\ClientDeclarations\RecentNotesData;
use Tests\Support\Exceptions\SimulatedFailure;

final class BrokenResolver implements SectionResolver
{
    public function read(SlotContext $context): RecentNotesData
    {
        throw SimulatedFailure::of('The shelf database is gone.');
    }
}
