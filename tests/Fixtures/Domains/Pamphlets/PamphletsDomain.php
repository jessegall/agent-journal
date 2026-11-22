<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Pamphlets;

use App\Support\Domain;
use App\Support\Exports;
use App\Contracts\ShareGatewayProvider;
use App\Contracts\ShareRecordContributor;
use App\Support\ShareRecordDefinition;

final class PamphletsDomain extends Domain implements ShareGatewayProvider, ShareRecordContributor
{
    public function description(): string
    {
        return 'A fixture domain whose pamphlets can be shared with their owned notes, through its own press gateway.';
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
        return [
            new ShareRecordDefinition(
'pamphlets.pamphlet',
 Pamphlet::class,
 PamphletShareProvider::class,
 ['share-linked-record'],
),
            new ShareRecordDefinition(
'pamphlets.note',
 PamphletNote::class,
 PamphletShareProvider::class,
 ['share-note'],
),
        ];
    }

    public function shareGateways(): array
    {
        return ['press' => PressGateway::class];
    }
}
