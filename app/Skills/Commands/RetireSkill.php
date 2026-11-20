<?php

declare(strict_types=1);

namespace App\Skills\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\Operation;
use App\Bus\Contracts\AuthorizedCommand;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use App\Skills\Enums\SkillAbility;
use App\Skills\Handlers\RetireSkillHandler;
use App\Skills\Models\Skill;
use App\Skills\Policies\SkillAuthoringPolicy;
use App\Skills\Values\SkillRevisionResult;

/**
 * The owner retires a stored skill: no selection offers it again, and its revisions stay readable.
 *
 * @extends Command<SkillRevisionResult>
 */
#[HandledBy(RetireSkillHandler::class)]
#[Authorize(SkillAuthoringPolicy::class, SkillAbility::Administer)]
#[Operation('skills_retire', ResourceAreaType::JournalContent, AccessType::Edit)]
final readonly class RetireSkill extends Command implements AuthorizedCommand
{
    public function __construct(
        public string $skill,
        public int $expectedRevision,
        public string $requestId,
    ) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return Skill::class;
    }
}
