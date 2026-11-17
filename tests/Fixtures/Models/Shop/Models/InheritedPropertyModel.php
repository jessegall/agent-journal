<?php

declare(strict_types=1);

namespace Tests\Fixtures\Models\Shop\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['name'])]
final class InheritedPropertyModel extends FillableBaseModel {}
