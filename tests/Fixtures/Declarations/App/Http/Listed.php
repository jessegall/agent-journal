<?php

declare(strict_types=1);

namespace Tests\Fixtures\Declarations\App\Http;

use Tests\Fixtures\Declarations\Good\GoodItem;

final class Listed
{
    public function item(): GoodItem
    {
        return new GoodItem();
    }
}
