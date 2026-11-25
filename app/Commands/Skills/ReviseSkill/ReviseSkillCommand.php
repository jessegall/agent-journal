<?php

declare(strict_types=1);

namespace App\Commands\Skills\ReviseSkill;

use App\Attributes\Authorize;
use App\Enums\Agents\AccessType;
use App\Policies\SkillAuthoringPolicy;
use App\Support\Command;
use App\Values\SkillDraft;
use App\Values\SkillRevisionResult;

/**
 * A user saves a new revision of a stored skill, against the revision they read; a save against an older one is
 * refused.
 *
 * @extends Command<SkillRevisionResult>
 */
#[Authorize(SkillAuthoringPolicy::class, AccessType::Edit)]
final readonly class ReviseSkillCommand extends Command
{
    public function __construct(
        public string $skill,
        public int $expectedRevision,
        public string $requestId,
        public SkillDraft $draft,
    ) {}
}
