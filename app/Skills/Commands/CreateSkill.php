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
use App\Skills\Handlers\CreateSkillHandler;
use App\Skills\Models\Skill;
use App\Skills\Policies\SkillAuthoringPolicy;
use App\Skills\Values\SkillDraft;
use App\Skills\Values\SkillRevisionResult;

/**
 * A user stores a new skill under a user- key; its first revision is the draft. A retry under the same request id
 * answers the same result.
 *
 * @extends Command<SkillRevisionResult>
 */
#[HandledBy(CreateSkillHandler::class)]
#[Authorize(SkillAuthoringPolicy::class, SkillAbility::Administer)]
#[Operation('skills_make', ResourceAreaType::JournalContent, AccessType::Create)]
final readonly class CreateSkill extends Command implements AuthorizedCommand
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
