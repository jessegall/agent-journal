<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\ClassRequiring;

use App\Domains\Support\Domain;
use App\Exports\Support\Exports;
use Tests\Fixtures\Domains\Tasks\TaskList;

final class ClassRequiringDomain extends Domain
{
    public function description(): string
    {
        return 'A fixture domain that requires a class that is not a domain.';
    }

    public function requires(): array
    {
        // @phpstan-ignore return.type (this fixture breaks the contract on purpose)
        return [TaskList::class];
    }

    public function exports(): Exports
    {
        return Exports::make()
            ->build();
    }
}
