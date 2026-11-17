<?php

declare(strict_types=1);

namespace Tests\Fixtures\Models\Shop\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['title'])]
final class GoodChildModel extends ShopModel {}
