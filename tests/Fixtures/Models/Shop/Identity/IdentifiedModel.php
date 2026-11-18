<?php

declare(strict_types=1);

namespace Tests\Fixtures\Models\Shop\Identity;

use App\Reads\Support\BoundedReads;
use App\Reads\Contracts\ReadableModel;
use App\Links\Support\Linkable;
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
