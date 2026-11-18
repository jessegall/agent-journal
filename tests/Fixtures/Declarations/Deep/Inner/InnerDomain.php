<?php

declare(strict_types=1);

namespace Tests\Fixtures\Declarations\Deep\Inner;

use App\Domains\Support\Domain;
use App\Exports\Support\Exports;

final class InnerDomain extends Domain
{
    public function description(): string
    {
        return 'A fixture domain one level too deep.';
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
