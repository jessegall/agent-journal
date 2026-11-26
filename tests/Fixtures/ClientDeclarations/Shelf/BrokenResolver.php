<?php

declare(strict_types=1);

namespace Tests\Fixtures\ClientDeclarations\Shelf;

use App\Declarations\SlotContext;
use App\Navigation\Contracts\SectionResolver;
use Tests\Fixtures\ClientDeclarations\RecentNotesData;
use Tests\Support\Exceptions\SimulatedFailure;

final class BrokenResolver implements SectionResolver
{
    public function read(SlotContext $context): RecentNotesData
    {
        throw SimulatedFailure::of('The shelf database is gone.');
    }
}
