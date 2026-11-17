<?php

declare(strict_types=1);

namespace Tests\Fixtures\Boundary\Tables\Tasks\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['title'])]
final class Task extends Model {}
