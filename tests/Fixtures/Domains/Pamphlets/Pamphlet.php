<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Pamphlets;

use App\Records\Support\RecordIdentity;
use App\Sharing\Contracts\Shareable;
use App\Sharing\Support\ShareRelationSet;

final class Pamphlet implements Shareable
{
    public function __construct(private readonly string $id) {}

    public function shareIdentity(): RecordIdentity
    {
        return new RecordIdentity('pamphlets.pamphlet', $this->id);
    }

    public static function shareRelations(): ShareRelationSet
    {
        return ShareRelationSet::owned('notes', 'share-note');
    }
}
