<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\DoubleRequiring;

use App\Domains\Support\Domain;
use Tests\Fixtures\Domains\Tasks\TasksDomain;

final class DoubleRequiringDomain extends Domain
{
    public function description(): string
    {
        return 'A fixture domain that requires Tasks twice.';
    }

    public function requires(): array
    {
        return [TasksDomain::class, TasksDomain::class];
    }

    /**
     * @return list<class-string>
     */
    public function exports(): array
    {
        return [];
    }
}
