<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Nesting\Inner;

use App\Domains\Support\Domain;
use App\Exports\Support\Exports;

final class InnerDomain extends Domain
{
    public function description(): string
    {
        return 'A fixture domain inside the folder and namespace of another domain.';
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
