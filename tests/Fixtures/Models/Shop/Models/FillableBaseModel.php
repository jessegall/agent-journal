<?php

declare(strict_types=1);

namespace Tests\Fixtures\Models\Shop\Models;

use Illuminate\Database\Eloquent\Model;

abstract class FillableBaseModel extends Model
{
    protected $fillable = ['secret'];
}
