<?php

declare(strict_types=1);

namespace App\Commands\Skills\RetireSkill;

use App\Attributes\Authorize;
use App\Enums\AccessType;
use App\Policies\SkillAuthoringPolicy;
use App\Support\Command;
use App\Values\SkillRevisionResult;

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
