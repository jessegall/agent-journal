<?php

declare(strict_types=1);

namespace Tests\Fixtures\Models\Shop;

use App\Domain\Contracts\Domain;

final class ShopDomain implements Domain
{
    public function description(): string
    {
        return 'A fixture domain for the model conventions.';
    }

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
