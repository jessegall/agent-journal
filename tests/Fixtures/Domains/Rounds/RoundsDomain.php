<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Rounds;

use App\Assignments\Contracts\AutoAssignmentProvider;
use App\Assignments\Support\PoolDefinition;
use App\Domains\Concerns\HasAssignables;
use App\Domains\Support\Domain;
use App\Exports\Support\Exports;
use Tests\Fixtures\Domains\Errands\ErrandsDomain;
use Tests\Fixtures\Domains\Errands\OpenErrandPools;

/**
 * A fixture domain that requires Errands and declares a pool of its errands, with no record type of its own.
 */
final class RoundsDomain extends Domain implements AutoAssignmentProvider
{
    use HasAssignables;

    public function description(): string
    {
        return 'A fixture domain that declares a pool of another domain\'s records.';
    }

    public function requires(): array
    {
        return [ErrandsDomain::class];
    }

    public function exports(): Exports
    {
        return Exports::make()
            ->build();
    }

    public function autoAssigners(): array
    {
        return [];
    }

    public function assignmentPools(): array
    {
        return [
            new PoolDefinition('rounds.errands', ErrandsDomain::ERRAND, OpenErrandPools::class, 'Errands on a round'),
        ];
    }
}
