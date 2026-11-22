<?php

declare(strict_types=1);

namespace Tests\Fixtures\Boundary\Tables\Tasks;

use App\Support\Domain;
use App\Support\Exports;

final class TasksDomain extends Domain
{
    public function description(): string
    {
        return 'A fixture domain for the table rules.';
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
