<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Pamphlets;

use App\Domains\Support\Domain;
use App\Exports\Support\Exports;
use App\Sharing\Contracts\ShareGatewayProvider;
use App\Sharing\Contracts\ShareRecordContributor;
use App\Sharing\Support\ShareRecordDefinition;

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
