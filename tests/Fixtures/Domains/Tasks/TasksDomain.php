<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Tasks;

use App\Support\Domain;
use App\Support\Exports;

final class TasksDomain extends Domain
{
    public function description(): string
    {
        return 'A fixture domain that requires nothing.';
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
