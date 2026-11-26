<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Flyers;

use App\Sharing\Contracts\ShareRecordContributor;
use App\Support\Domain;
use App\Support\Exports;
use App\Support\ShareRecordDefinition;
use Tests\Fixtures\Domains\Pamphlets\PamphletShareProvider;

/**
 * Registers a record type whose relation needs a capability no record advertises.
 */
final class FlyersDomain extends Domain implements ShareRecordContributor
{
    public function description(): string
    {
        return 'A fixture domain whose shareable record names an unknown capability.';
    }

    public function requires(): array
    {
        return [];
    }

    public function exports(): Exports
    {
        return Exports::make()->build();
    }

    public function shareRecords(): array
    {
        return [new ShareRecordDefinition('flyers.flyer', Flyer::class, PamphletShareProvider::class, [])];
    }
}
