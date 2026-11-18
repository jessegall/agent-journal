<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\TwoCycle\Payments;

use App\Domains\Contracts\Domain;
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

    /**
     * @return list<class-string>
     */
    public function exports(): array
    {
        return [];
    }
}
