<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\TwoCycle\Payments;

use App\Support\Domain;
use App\Support\Exports;
use Tests\Fixtures\Domains\TwoCycle\Orders\OrdersDomain;

final class PaymentsDomain extends Domain
{
    public function description(): string
    {
        return 'A fixture domain in a cycle of two.';
    }

    public function requires(): array
    {
        return [OrdersDomain::class];
    }

    public function exports(): Exports
    {
        return Exports::make()
            ->build();
    }
}
