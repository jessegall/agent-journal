<?php

declare(strict_types=1);

namespace Tests\Fixtures\Declarations\Good;

use App\Domain\Domain;

final class GoodDomain implements Domain
{
    public function description(): string
    {
        return 'A fixture domain named the right way.';
    }

    public function requires(): array
    {
        return [];
    }
}
