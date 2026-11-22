<?php

declare(strict_types=1);

namespace App\Commands\RestoreSkill;

use App\Attributes\Authorize;
use App\Enums\AccessType;
use App\Policies\SkillAuthoringPolicy;
use App\Support\Command;
use App\Values\SkillRevisionResult;

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
