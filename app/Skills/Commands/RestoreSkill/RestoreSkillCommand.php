<?php

declare(strict_types=1);

namespace App\Skills\Commands\RestoreSkill;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Policies\SkillAuthoringPolicy;
use App\Skills\Values\SkillRevisionResult;
use App\Support\Command;

/**
 * A user restores an earlier revision's content as a new revision, checked against today's rules; history stays.
 *
 * @extends Command<SkillRevisionResult>
 */
#[Authorize(SkillAuthoringPolicy::class, AccessType::Edit)]
final readonly class RestoreSkillCommand extends Command
{
    public function __construct(
        public string $skill,
        public int $revision,
        public int $expectedRevision,
        public string $requestId,
    ) {}
}
