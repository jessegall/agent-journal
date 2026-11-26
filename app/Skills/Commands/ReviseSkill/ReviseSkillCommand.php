<?php

declare(strict_types=1);

namespace App\Skills\Commands\ReviseSkill;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Policies\SkillAuthoringPolicy;
use App\Skills\Values\SkillDraft;
use App\Skills\Values\SkillRevisionResult;
use App\Support\Command;

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
