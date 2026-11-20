<?php

declare(strict_types=1);

namespace Tests\Fixtures\Links;

use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

/**
 * A second test model type to link notes to.
 *
 * @property string $id
 * @property string $name
 */
#[Fillable(['name'])]
final class Label extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;

    public static function named(string $name): self
    {
        return self::query()->create(['name' => $name]);
    }

}
