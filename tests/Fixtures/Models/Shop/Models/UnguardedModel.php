<?php

declare(strict_types=1);

namespace Tests\Fixtures\Models\Shop\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Unguarded;
use Illuminate\Database\Eloquent\Model;

#[Unguarded]
#[Fillable(['name'])]
final class UnguardedModel extends Model {}
