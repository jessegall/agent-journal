<?php

declare(strict_types=1);

namespace Tests\Fixtures\Models\Shop\Calls;

use Tests\Fixtures\Models\Shop\Models\GoodModel;

final class ForceCreate
{
    public function open(): GoodModel
    {
        return GoodModel::forceCreate(['secret' => 'x']);
    }
}
