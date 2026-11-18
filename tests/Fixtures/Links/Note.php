<?php

declare(strict_types=1);

namespace Tests\Fixtures\Links;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use App\Links\Support\Linkable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

/**
 * A test model whose global scope shows only the notes of the owner named visible.
 *
 * @property string $id
 * @property string $owner
 */
#[Fillable(['owner'])]
final class Note extends Model
{
    use HasUlids, Linkable;

    protected static function booted(): void
    {
        self::addGlobalScope('visible owner', fn (Builder $query) => $query->where('owner', 'visible'));
    }
}
