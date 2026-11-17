<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\TwoCycle\Orders;

use App\Domain\Domain;
use Tests\Fixtures\Domains\TwoCycle\Payments\PaymentsDomain;

final class OrdersDomain implements Domain
{
    public function description(): string
    {
        return 'A fixture domain in a cycle of two.';
    }

    public function requires(): array
    {
        return [PaymentsDomain::class];
    }
}
