<?php

declare(strict_types=1);

namespace App\Sharing\Models\Support;

use App\Records\Support\RecordIdentity;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;

/**
 * For a sharing model whose rows are about one root record, kept in its root_type and root_id columns.
 */
trait BelongsToOneRoot
{
    /**
     * @param  Builder<static>  $query
     */
    #[Scope]
    protected function ofRoot(Builder $query, RecordIdentity $root): void
    {
        $query->where('root_type', $root->type)->where('root_id', $root->id);
    }
}
