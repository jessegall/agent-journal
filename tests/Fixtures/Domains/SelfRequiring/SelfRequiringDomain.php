<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\SelfRequiring;

use App\Exports\Support\Exports;
use App\Domains\Support\Domain;

final class SelfRequiringDomain extends Domain
{
    public function description(): string
    {
        return 'A fixture domain that requires itself.';
    }

    public function requires(): array
    {
        return [self::class];
    }

    public function exports(): Exports
    {
        return Exports::make()
            ->build();
    }
}
