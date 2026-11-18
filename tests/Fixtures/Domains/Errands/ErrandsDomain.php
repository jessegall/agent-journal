<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Errands;

use App\Assignments\Contracts\ProvidesAutoAssignments;
use App\Assignments\Support\AutoAssignerDefinition;
use App\Assignments\Support\PoolDefinition;
use App\Domains\Concerns\HasAssignables;
use App\Domains\Contracts\ProvidesAssignables;
use App\Domains\Support\Domain;
use App\Exports\Support\Exports;

/**
 * A fixture domain whose errands actors hold, with an auto-assigner and a pool of open errands.
 */
final class ErrandsDomain extends Domain implements ProvidesAssignables, ProvidesAutoAssignments
{
    use HasAssignables;

    public const string ERRAND = 'errands.errand';

    public function description(): string
    {
        return 'A fixture domain that declares an assignable type, its auto-assigner and a pool.';
    }

    public function requires(): array
    {
        return [];
    }

    public function exports(): Exports
    {
        return Exports::make()
            ->build();
    }

    public function assignables(): array
    {
        return [self::ERRAND => ErrandAssignables::class];
    }

    public function autoAssigners(): array
    {
        return [new AutoAssignerDefinition(self::ERRAND, ErrandAssigner::class, ErrandWork::class)];
    }

    public function assignmentPools(): array
    {
        return [new PoolDefinition('errands.open', self::ERRAND, OpenErrandPools::class, 'Open errands')];
    }
}
