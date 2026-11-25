<?php

declare(strict_types=1);

namespace App\Commands\Skills\CreateSkill;

use App\Attributes\Commands\Authorize;
use App\Enums\Agents\AccessType;
use App\Policies\SkillAuthoringPolicy;
use App\Support\Command;
use App\Values\SkillDraft;
use App\Values\SkillRevisionResult;

/**
 * A user stores a new skill under a user- key; its first revision is the draft. A retry under the same request id
 * answers the same result.
 *
 * @extends Command<SkillRevisionResult>
 */
#[Authorize(SkillAuthoringPolicy::class, AccessType::Create)]
final readonly class CreateSkillCommand extends Command
{
    public function __construct(
        public string $key,
        public string $requestId,
        public SkillDraft $draft,
    ) {}
}
