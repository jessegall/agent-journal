<?php

declare(strict_types=1);

namespace Tests\Fixtures\Models\Shop\Models;

use Illuminate\Database\Eloquent\Attributes\Guarded;
use Illuminate\Database\Eloquent\Model;

#[Guarded([])]
final class EmptyGuardedModel extends Model {}
