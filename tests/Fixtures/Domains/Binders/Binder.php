<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Binders;

use App\Records\Contracts\Shareable;
use App\Records\Values\ShareRelationSet;
use App\Support\RecordIdentity;

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
