<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\TwoCycle\Orders;

use App\Domains\Support\Domain;
use App\Exports\Support\Exports;
use Tests\Fixtures\Domains\TwoCycle\Payments\PaymentsDomain;

final class OrdersDomain extends Domain
{
    public function description(): string
    {
        return 'A fixture domain in a cycle of two.';
    }

    public function requires(): array
    {
        return [PaymentsDomain::class];
    }

    public function exports(): Exports
    {
        return Exports::make()
            ->build();
    }
}
