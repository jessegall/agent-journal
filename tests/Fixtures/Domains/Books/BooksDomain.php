<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Books;

use App\Exports\Support\Exports;
use App\Domains\Support\Domain;

final class BooksDomain extends Domain
{
    public function description(): string
    {
        return 'A fixture domain with a migration of its own.';
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
