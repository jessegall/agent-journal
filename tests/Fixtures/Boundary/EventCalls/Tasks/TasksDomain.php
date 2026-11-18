<?php

declare(strict_types=1);

namespace Tests\Fixtures\Boundary\EventCalls\Tasks;

use App\Domains\Contracts\Domain;

final class TasksDomain implements Domain
{
    public function description(): string
    {
        return 'A fixture domain that raises TaskClosed.';
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
