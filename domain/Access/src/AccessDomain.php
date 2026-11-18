<?php

declare(strict_types=1);

namespace Domain\Access;

use App\Actors\Enums\ActorType;
use App\Assignments\Support\AssigneeRegistration;
use App\Domains\Concerns\HasAssignables;
use App\Domains\Contracts\ProvidesAssignees;
use App\Domains\Support\Domain;
use App\Exports\Support\Exports;
use Domain\Access\Support\UserAssignees;

final class AccessDomain extends Domain implements ProvidesAssignees
{
    use HasAssignables;

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

    public function exports(): Exports
    {
        return Exports::make()
            ->build();
    }

    /**
     * @return list<AssigneeRegistration>
     */
    public function assignees(): array
    {
        return [new AssigneeRegistration(ActorType::User, UserAssignees::class)];
    }
}
