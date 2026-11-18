<?php

declare(strict_types=1);

namespace Tests\Fixtures\Boundary\Tasks;

use App\Domains\Support\Domain;
use App\Exports\Support\Exports;
use Tests\Fixtures\Boundary\Chat\ChatDomain;

final class TasksDomain extends Domain
{
    public function description(): string
    {
        return 'A fixture domain that requires Chat.';
    }

    public function requires(): array
    {
        return [ChatDomain::class];
    }

    public function exports(): Exports
    {
        return Exports::make()
            ->values(Task::class)
            ->build();
    }
}
