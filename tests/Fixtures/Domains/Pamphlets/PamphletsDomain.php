<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Pamphlets;

use App\Domains\Concerns\HasShareGateways;
use App\Domains\Concerns\HasShareRecords;
use App\Domains\Support\Domain;
use App\Exports\Support\Exports;
use App\Sharing\Contracts\ProvidesShareGateways;
use App\Sharing\Contracts\ProvidesShareRecords;
use App\Sharing\Support\ShareRecordRegistration;

final class PamphletsDomain extends Domain implements ProvidesShareGateways, ProvidesShareRecords
{
    use HasShareGateways;
    use HasShareRecords;

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
            new ShareRecordRegistration('pamphlets.pamphlet', Pamphlet::class, PamphletShareProvider::class, ['share-linked-record']),
            new ShareRecordRegistration('pamphlets.note', PamphletNote::class, PamphletShareProvider::class, ['share-note']),
        ];
    }

    public function shareGateways(): array
    {
        return ['press' => PressGateway::class];
    }
}
