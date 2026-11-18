<?php

declare(strict_types=1);

namespace Tests\Fixtures\Declarations\Based;

use App\Domains\Support\Domain;

abstract class AbstractBasedDomain extends Domain
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
