<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Flyers;

use App\Support\RecordIdentity;
use App\Contracts\Shareable;
use App\Support\ShareRelationSet;

final class Flyer implements Shareable
{
    public function __construct(private readonly string $id) {}

    public function shareIdentity(): RecordIdentity
    {
        return new RecordIdentity('flyers.flyer', $this->id);
    }

    public static function shareRelations(): ShareRelationSet
    {
        return ShareRelationSet::linked('records', 'share-nothing-advertises');
    }
}
