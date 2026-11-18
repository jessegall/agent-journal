<?php

declare(strict_types=1);

namespace Tests\Fixtures\Boundary\Events\Tasks;

use App\Domains\Contracts\Domain;
use Tests\Fixtures\Boundary\Events\Tasks\Events\TaskClosed;

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
        return [TaskClosed::class];
    }
}
