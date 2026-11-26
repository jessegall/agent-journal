<?php

declare(strict_types=1);

namespace App\Concerns;

use App\Assignments\Contracts\AssignableContributor;
use App\Assignments\Contracts\AssigneeContributor;
use App\Assignments\Contracts\AutoAssignmentProvider;
use App\Assignments\Contracts\InternalAssignableContributor;
use App\Bootstrap\Attributes\Rules\RequiresInterface;
use App\Contracts\Domains\DomainBootstrapper;
use App\Support\Bootstrappers\RegisterAssignables;

/**
 * Boots the records actors may hold, or actor types that hold records a domain declares through its capability
 * interface.
 */
#[RequiresInterface(
    AssignableContributor::class,
    AssigneeContributor::class,
    AutoAssignmentProvider::class,
    InternalAssignableContributor::class,
)]
trait HasAssignables
{
    /**
     * @return list<class-string<DomainBootstrapper>>
     */
    protected function bootstrappersHasAssignables(): array
    {
        return [RegisterAssignables::class];
    }
}
