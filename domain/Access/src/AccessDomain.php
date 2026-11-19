<?php

declare(strict_types=1);

namespace Domain\Access;

use App\Actors\Enums\ActorType;
use App\Assignments\Support\ActivityRegistration;
use App\Assignments\Support\AssigneeRegistration;
use App\Domains\Concerns\HasAssignables;
use App\Domains\Contracts\ProvidesAssignees;
use App\Domains\Support\Domain;
use App\Exports\Support\Exports;
use App\Skills\Contracts\ProvidesSkills;
use Domain\Access\Skills\AccessSkill;
use Domain\Access\Support\UserActivity;
use Domain\Access\Support\UserAssignees;

final class AccessDomain extends Domain implements ProvidesAssignees, ProvidesSkills
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

    /**
     * Signing in and the owner policy are needed to switch anything back on, so Access is always on.
     */
    public function canDisable(): bool
    {
        return false;
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
        return [new AssigneeRegistration(ActorType::User->value, UserAssignees::class)];
    }

    /**
     * @return list<ActivityRegistration>
     */
    public function activities(): array
    {
        return [new ActivityRegistration(ActorType::User, UserActivity::class)];
    }

    public function skills(): array
    {
        return [AccessSkill::class];
    }
}
