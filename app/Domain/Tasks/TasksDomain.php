<?php

declare(strict_types=1);

namespace App\Domain\Tasks;

use App\Domain\Domain;

final class TasksDomain implements Domain
{
    public function description(): string
    {
        return 'A task, its state, its log and what it waits on.';
    }

    /**
     * @return list<class-string<Domain>>
     */
    public function requires(): array
    {
        return [];
    }
}
