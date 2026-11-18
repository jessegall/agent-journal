<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Binders;

use App\Records\Support\RecordIdentity;
use App\Sharing\Contracts\Shareable;
use App\Sharing\Support\ShareRelationSet;

final class BinderPage implements Shareable
{
    public function __construct(private readonly string $type, private readonly string $id) {}

    public function shareIdentity(): RecordIdentity
    {
        return new RecordIdentity($this->type, $this->id);
    }

    public static function shareRelations(): ShareRelationSet
    {
        return ShareRelationSet::none();
    }
}
