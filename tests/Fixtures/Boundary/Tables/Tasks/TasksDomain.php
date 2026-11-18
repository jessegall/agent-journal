<?php

declare(strict_types=1);

namespace Tests\Fixtures\Boundary\Tables\Tasks;

use App\Domains\Support\Domain;

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

    /**
     * @return list<class-string>
     */
    public function exports(): array
    {
        return [];
    }
}
