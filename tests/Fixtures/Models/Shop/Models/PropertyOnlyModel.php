<?php

declare(strict_types=1);

namespace Tests\Fixtures\Models\Shop\Models;

use Illuminate\Database\Eloquent\Model;

final class PropertyOnlyModel extends Model
{
    protected $fillable = ['name'];
}
