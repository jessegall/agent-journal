<?php

declare(strict_types=1);

namespace Tests\Fixtures\Models\Shop;

use App\Exports\Support\Exports;
use App\Domains\Support\Domain;

final class ShopDomain extends Domain
{
    public function description(): string
    {
        return 'A fixture domain for the model conventions.';
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
