<?php

declare(strict_types=1);

namespace Domain\Access;

use App\Concerns\HasAssignables;
use App\Contracts\Assignments\AssigneeContributor;
use App\Contracts\Authorization\PolicyProvider;
use App\Contracts\Bus\CommandProvider;
use App\Contracts\Skills\SkillProvider;
use App\Enums\AccessType;
use App\Enums\ActorType;
use App\Support\ActivityDefinition;
use App\Support\AssigneeDefinition;
use App\Support\Command;
use App\Support\Domain;
use App\Support\Exports;
use App\Support\FolderClasses;
use App\Values\PolicyDefinition;
use Domain\Access\Policies\EnvironmentAccessPolicy;
use Domain\Access\Support\Skills\AccessSkill;
use Domain\Access\Support\UserActivity;
use Domain\Access\Support\UserAssignees;

final class AccessDomain extends Domain implements AssigneeContributor, CommandProvider, PolicyProvider, SkillProvider
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

    public function policies(): array
    {
        return [new PolicyDefinition(EnvironmentAccessPolicy::class, [AccessType::Edit])];
    }

    public function commands(): array
    {
        return FolderClasses::in(__DIR__.'/Commands/*', Command::class);
    }
}
