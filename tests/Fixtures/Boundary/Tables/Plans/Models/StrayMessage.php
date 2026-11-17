<?php

declare(strict_types=1);

namespace Tests\Fixtures\Boundary\Tables\Plans\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['body'])]
#[Table('messages')]
final class StrayMessage extends Model {}
