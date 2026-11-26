<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Binders;

use App\Sharing\Contracts\Shareable;
use App\Support\RecordIdentity;
use App\Support\ShareRelationSet;

final class Binder implements Shareable
{
    public function __construct(private readonly string $id) {}

    public function shareIdentity(): RecordIdentity
    {
        return new RecordIdentity('binders.binder', $this->id);
    }

    public static function shareRelations(): ShareRelationSet
    {
        return ShareRelationSet::linked('records', 'share-linked-record');
    }
}
