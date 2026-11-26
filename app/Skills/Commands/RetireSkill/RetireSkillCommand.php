<?php

declare(strict_types=1);

namespace App\Skills\Commands\RetireSkill;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Policies\SkillAuthoringPolicy;
use App\Skills\Values\SkillRevisionResult;
use App\Support\Command;

/**
 * The owner retires a stored skill: no selection offers it again, and its revisions stay readable.
 *
 * @extends Command<SkillRevisionResult>
 */
#[Authorize(SkillAuthoringPolicy::class, AccessType::Edit)]
final readonly class RetireSkillCommand extends Command
{
    public function __construct(
        public string $skill,
        public int $expectedRevision,
        public string $requestId,
    ) {}
}
