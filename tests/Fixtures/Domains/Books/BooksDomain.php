<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Books;

use App\Domains\Domain;

final class BooksDomain implements Domain
{
    public function description(): string
    {
        return 'A fixture domain with a migration of its own.';
    }

    public function requires(): array
    {
        return [];
    }
}
