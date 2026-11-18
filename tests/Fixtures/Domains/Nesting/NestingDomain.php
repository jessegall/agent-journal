<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Nesting;

use App\Domains\Support\Domain;
use App\Exports\Support\Exports;

final class NestingDomain extends Domain
{
    public function description(): string
    {
        return 'A fixture domain another one sits inside.';
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
