<?php

declare(strict_types=1);

namespace Tests\Fixtures\Models\Shop\Identity;

use App\Concerns\Linkable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['name'])]
final class IntegerKeyModel extends Model
{
    use Linkable;
}
