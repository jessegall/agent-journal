<?php

declare(strict_types=1);

namespace App\Skills\Commands;

use App\Bus\Attributes\Operation;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Bus\Support\Command;
use App\Skills\Enums\SkillAbility;
use App\Skills\Handlers\ReviseSkillHandler;
use App\Skills\Models\Skill;
use App\Skills\Policies\SkillAuthoringPolicy;
use App\Skills\Values\SkillDraft;
use App\Skills\Values\SkillRevisionResult;

/**
 * A user saves a new revision of a stored skill, against the revision they read; a save against an older one is
 * refused.
 *
 * @extends Command<SkillRevisionResult>
 */
#[HandledBy(ReviseSkillHandler::class)]
#[Authorize(SkillAuthoringPolicy::class, SkillAbility::Administer)]
#[Operation('skills_edit', ResourceAreaType::JournalContent, AccessType::Edit)]
final readonly class ReviseSkill extends Command implements HasAuthorizationSubject
{
    public function __construct(
        public string $skillId,
        public int $expectedRevision,
        public string $requestId,
        public SkillDraft $draft,
    ) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return Skill::class;
    }
}
