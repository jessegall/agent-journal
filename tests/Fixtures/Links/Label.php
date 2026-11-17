<?php

declare(strict_types=1);

namespace Tests\Fixtures\Links;

use App\Core\Links\Support\Linkable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

/**
 * A second test model type to link notes to.
 *
 * @property int $id
 * @property string $name
 */
#[Fillable(['name'])]
final class Label extends Model
{
    use Linkable;
}
