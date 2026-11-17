<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\SelfRequiring;

use App\Domain\Domain;

final class SelfRequiringDomain implements Domain
{
    public function description(): string
    {
        return 'A fixture domain that requires itself.';
    }

    public function requires(): array
    {
        return [self::class];
    }
}
