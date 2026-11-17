<?php

declare(strict_types=1);

namespace Tests\Fixtures\Models\Shop\Calls;

use Tests\Fixtures\Models\Shop\Models\GoodModel;

final class ForceFill
{
    public function open(GoodModel $model): GoodModel
    {
        return $model->forceFill(['secret' => 'x']);
    }
}
