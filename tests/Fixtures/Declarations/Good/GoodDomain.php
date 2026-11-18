<?php

declare(strict_types=1);

namespace Tests\Fixtures\Declarations\Good;

use App\Domains\Support\Domain;
use App\Exports\Support\Exports;

final class GoodDomain extends Domain
{
    public function description(): string
    {
        return 'A fixture domain named the right way.';
    }

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
