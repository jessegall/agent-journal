<?php

declare(strict_types=1);

namespace Tests\Fixtures\Models\Shop\Identity;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Records\Contracts\ReadableModel;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['name'])]
final class IdentifiedModel extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;
}
