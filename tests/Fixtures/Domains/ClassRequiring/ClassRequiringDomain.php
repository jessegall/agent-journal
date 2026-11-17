<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\ClassRequiring;

use App\Domains\Domain;
use Tests\Fixtures\Domains\Tasks\TaskList;

final class ClassRequiringDomain implements Domain
{
    public function description(): string
    {
        return 'A fixture domain that requires a class that is not a domain.';
    }

    /**
     * @phpstan-ignore return.type
     */
    public function requires(): array
    {
        return [TaskList::class];
    }
}
