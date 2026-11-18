<?php

declare(strict_types=1);

namespace Tests\Fixtures\Declarations\Based;

use App\Domains\Support\Domain;
use App\Exports\Support\Exports;

abstract class AbstractBasedDomain extends Domain
{
    public function requires(): array
    {
        return [];
    }

    public function exports(): Exports
    {
        return Exports::make()
            ->build();
    }
}
