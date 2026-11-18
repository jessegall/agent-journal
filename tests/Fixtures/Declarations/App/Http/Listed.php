<?php

declare(strict_types=1);

namespace Tests\Fixtures\Declarations\App\Http;

use Tests\Fixtures\Declarations\Good\Thing;

final class Listed
{
    public function thing(): Thing
    {
        return new Thing();
    }
}
