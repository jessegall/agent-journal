<?php

declare(strict_types=1);

namespace App\Skills\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Skills\Enums\SkillAbility;
use App\Skills\Handlers\CreateSkillHandler;
use App\Skills\Models\Skill;
use App\Skills\Policies\SkillAuthoringPolicy;
use App\Skills\Values\SkillDraft;
use App\Skills\Values\SkillRevisionResult;

/**
 * A user stores a new skill under a user- key; its first revision is the draft. A retry under the same request id
 * answers the same result.
 *
 * @implements Command<SkillRevisionResult>
 */
#[HandledBy(CreateSkillHandler::class)]
#[Authorize(SkillAuthoringPolicy::class, SkillAbility::Administer)]
final readonly class CreateSkill implements Command, HasAuthorizationSubject
{
    public function __construct(
        public string $key,
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
