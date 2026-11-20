<?php

declare(strict_types=1);

namespace Tests\Fixtures\Models\Shop\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Guarded;
use Illuminate\Database\Eloquent\Relations\Pivot;

#[Guarded(['*'])]
#[Fillable(['order_id'])]
final class ClosedPivot extends Pivot {}
