<?php

declare(strict_types=1);

namespace Tests\Fixtures\Models\Shop\Calls;

use Tests\Fixtures\Models\Shop\Models\GoodModel;

final class Unguarded
{
    public function open(): GoodModel
    {
        return GoodModel::unguarded(fn () => GoodModel::create(['name' => 'x']));
    }
}
