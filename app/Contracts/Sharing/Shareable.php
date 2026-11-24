<?php

declare(strict_types=1);

namespace App\Contracts\Sharing;

use App\Support\RecordIdentity;
use App\Support\ShareRelationSet;

/**
 * A model whose records can be shared, with the relations its type reaches other records through.
 */
interface Shareable
{
    /**
     * The record identity a share of this record names.
     */
    public function shareIdentity(): RecordIdentity;

    /**
     * The records of other kinds a share of this kind may take along.
     */
    public static function shareRelations(): ShareRelationSet;
}
