<?php

declare(strict_types=1);

namespace Tests\Fixtures\Models\Shop\Identity;

use App\Links\Support\Linkable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['name'])]
final class IdentifiedModel extends Model
{
    use HasUlids;
    use Linkable;
}
