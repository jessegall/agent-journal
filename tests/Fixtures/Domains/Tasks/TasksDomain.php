<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Tasks;

use App\Domain\Contracts\Domain;

final class TasksDomain implements Domain
{
    public function description(): string
    {
        return 'A fixture domain that requires nothing.';
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
