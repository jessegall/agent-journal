<?php

declare(strict_types=1);

namespace Tests\Fixtures\Declarations\Based;

use App\Support\Domain;
use App\Support\Exports;

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
