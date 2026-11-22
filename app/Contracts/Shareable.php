<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Support\RecordIdentity;
use App\Support\ShareRelationSet;

/**
 * A model whose records can be shared, with the relations its type reaches other records through.
 */
interface Shareable
{
    public function shareIdentity(): RecordIdentity;

    public static function shareRelations(): ShareRelationSet;
}
