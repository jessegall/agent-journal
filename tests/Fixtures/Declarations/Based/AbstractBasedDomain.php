<?php

declare(strict_types=1);

namespace Tests\Fixtures\Declarations\Based;

use App\Domains\Domain;

abstract class AbstractBasedDomain implements Domain
{
    public function requires(): array
    {
        return [];
    }
}
