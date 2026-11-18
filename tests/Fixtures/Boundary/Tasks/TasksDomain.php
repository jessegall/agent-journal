<?php

declare(strict_types=1);

namespace Tests\Fixtures\Boundary\Tasks;

use App\Domains\Contracts\Domain;
use Tests\Fixtures\Boundary\Chat\ChatDomain;

final class TasksDomain implements Domain
{
    public function description(): string
    {
        return 'A fixture domain that requires Chat.';
    }

    public function requires(): array
    {
        return [ChatDomain::class];
    }

    /**
     * @return list<class-string>
     */
    public function exports(): array
    {
        return [Task::class];
    }
}
