<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\TwoCycle\Payments;

use App\Domains\Domain;
use Tests\Fixtures\Domains\TwoCycle\Orders\OrdersDomain;

final class PaymentsDomain implements Domain
{
    public function description(): string
    {
        return 'A fixture domain in a cycle of two.';
    }

    public function requires(): array
    {
        return [OrdersDomain::class];
    }
}
