<?php

declare(strict_types=1);

namespace App\Domain\Tasks;

use App\Domain\Contracts\Domain;
use App\Domain\Tasks\Api\TaskProgress;
use App\Domain\Tasks\Contracts\TaskProgressCounter;
use App\Domain\Tasks\Contracts\TaskReader;
use App\Domain\Tasks\Exceptions\TaskMissing;

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

    /**
     * @return list<class-string>
     */
    public function exports(): array
    {
        return [
            TaskProgressCounter::class,
            TaskProgress::class,
            TaskReader::class,
            TaskMissing::class,
        ];
    }
}
