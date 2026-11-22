<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Pamphlets;

use App\Support\RecordIdentity;
use App\Contracts\Sharing\Shareable;
use App\Support\ShareRelationSet;

final class PamphletNote implements Shareable
{
    public function __construct(private readonly string $id) {}

    public function shareIdentity(): RecordIdentity
    {
        return new RecordIdentity('pamphlets.note', $this->id);
    }

    public static function shareRelations(): ShareRelationSet
    {
        return ShareRelationSet::none();
    }
}
