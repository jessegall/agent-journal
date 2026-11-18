<?php

declare(strict_types=1);

namespace Tests\Fixtures\Declarations\Based;

use App\Domains\Contracts\Domain;

abstract class AbstractBasedDomain implements Domain
{
    public function requires(): array
    {
        return [];
    }

    /**
     * @return list<class-string>
     */
    public function exports(): array
    {
        return [];
    }
}
