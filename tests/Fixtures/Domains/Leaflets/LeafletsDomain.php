<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Leaflets;

use App\Domains\Support\Domain;
use App\Exports\Support\Exports;
use App\Sharing\Contracts\ShareRecordContributor;
use App\Sharing\Support\ShareRecordDefinition;
use Tests\Fixtures\Domains\Pamphlets\Pamphlet;
use Tests\Fixtures\Domains\Pamphlets\PamphletShareProvider;

/**
 * Registers a second provider under the pamphlets' alias.
 */
final class LeafletsDomain extends Domain implements ShareRecordContributor
{
    public function description(): string
    {
        return 'A fixture domain that registers a shareable alias another domain already registered.';
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
        return [new ShareRecordDefinition('pamphlets.pamphlet', Pamphlet::class, PamphletShareProvider::class, [])];
    }
}
