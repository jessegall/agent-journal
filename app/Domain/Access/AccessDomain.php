<?php

declare(strict_types=1);

namespace App\Domain\Access;

use App\Core\Actors\Enums\ActorKind;
use App\Core\Assignments\Support\AssigneeRegistration;
use App\Domain\Access\Support\UserAssignees;
use App\Domain\Contracts\Domain;
use App\Domain\Contracts\ProvidesAssignees;

final class AccessDomain implements Domain, ProvidesAssignees
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
        return [new AssigneeRegistration(ActorKind::User, UserAssignees::class)];
    }
}
