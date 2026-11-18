<?php

declare(strict_types=1);

namespace Domain\Access;

use App\Actors\Enums\ActorType;
use App\Assignments\Support\AssigneeRegistration;
use App\Domains\Bootstrappers\LoadMigrations;
use App\Domains\Bootstrappers\RegisterAssignables;
use App\Domains\Contracts\Domain;
use App\Domains\Contracts\ProvidesAssignees;
use App\Domains\Contracts\ProvidesBootstrappers;
use Domain\Access\Support\UserAssignees;

final class AccessDomain implements Domain, ProvidesAssignees, ProvidesBootstrappers
{
    public function description(): string
    {
        return 'The users who sign in, how they sign in, and which of them may use the journal.';
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
        return [];
    }

    /**
     * @return list<AssigneeRegistration>
     */
    public function assignees(): array
    {
        return [new AssigneeRegistration(ActorType::User, UserAssignees::class)];
    }

    public function bootstrappers(): array
    {
        return [LoadMigrations::class, RegisterAssignables::class];
    }
}
