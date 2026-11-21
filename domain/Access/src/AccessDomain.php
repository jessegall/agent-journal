<?php

declare(strict_types=1);

namespace Domain\Access;

use App\Actors\Enums\ActorType;
use App\Assignments\Support\ActivityDefinition;
use App\Assignments\Support\AssigneeDefinition;
use App\Domains\Concerns\HasAssignables;
use App\Domains\Contracts\AssigneeContributor;
use App\Domains\Support\Domain;
use App\Exports\Support\Exports;
use App\Skills\Contracts\SkillProvider;
use Domain\Access\Skills\AccessSkill;
use Domain\Access\Support\UserActivity;
use Domain\Access\Support\UserAssignees;

final class AccessDomain extends Domain implements AssigneeContributor, SkillProvider
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
     * @return list<AssigneeDefinition>
     */
    public function assignees(): array
    {
        return [new AssigneeDefinition(ActorType::User->value, UserAssignees::class)];
    }

    /**
     * @return list<ActivityDefinition>
     */
    public function activities(): array
    {
        return [new ActivityDefinition(ActorType::User, UserActivity::class)];
    }

    public function skills(): array
    {
        return [AccessSkill::class];
    }
}
