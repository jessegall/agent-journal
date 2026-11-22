<?php

declare(strict_types=1);

namespace Tests\Fixtures\Links;

use App\Concerns\Linkable;
use App\Contracts\Records\ReadableModel;
use App\Concerns\BoundedReads;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

/**
 * A test model whose global scope shows only the notes of the owner named visible.
 *
 * @property string $id
 * @property string $owner
 */
#[Fillable(['owner'])]
final class Note extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;

    protected static function booted(): void
    {
        self::addGlobalScope('visible owner', fn (Builder $query) => $query->where('owner', 'visible'));
    }

    public static function ownedBy(string $owner): self
    {
        return self::query()->create(['owner' => $owner]);
    }

}
