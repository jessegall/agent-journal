<?php

declare(strict_types=1);

namespace Tests\Fixtures\Models\Shop\Identity;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['name'])]
final class UnlinkedModel extends Model
{
    use HasUlids;
}
