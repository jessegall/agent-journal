<?php

declare(strict_types=1);

namespace App\Skills\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Skills\Enums\SkillAbility;
use App\Skills\Handlers\RetireSkillHandler;
use App\Skills\Models\Skill;
use App\Skills\Policies\SkillAuthoringPolicy;
use App\Skills\Values\SkillRevisionResult;

/**
 * The owner retires a stored skill: no selection offers it again, and its revisions stay readable.
 *
 * @implements Command<SkillRevisionResult>
 */
#[HandledBy(RetireSkillHandler::class)]
#[Authorize(SkillAuthoringPolicy::class, SkillAbility::Administer)]
final readonly class RetireSkill implements Command, HasAuthorizationSubject
{
    public function __construct(
        public string $skillId,
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
