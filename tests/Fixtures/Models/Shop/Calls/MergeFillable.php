<?php

declare(strict_types=1);

namespace Tests\Fixtures\Models\Shop\Calls;

use Tests\Fixtures\Models\Shop\Models\GoodModel;

final class MergeFillable
{
    public function open(GoodModel $model): GoodModel
    {
        return $model->mergeFillable(['secret']);
    }
}
