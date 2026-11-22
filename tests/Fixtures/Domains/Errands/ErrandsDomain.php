<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Errands;

use App\Contracts\Assignments\AutoAssignmentProvider;
use App\Support\AutoAssignerDefinition;
use App\Support\PoolDefinition;
use App\Concerns\HasAssignables;
use App\Contracts\Assignments\AssignableContributor;
use App\Support\Domain;
use App\Support\Exports;

/**
 * A fixture domain whose errands actors hold, with an auto-assigner and a pool of open errands.
 */
final class ErrandsDomain extends Domain implements AssignableContributor, AutoAssignmentProvider
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
