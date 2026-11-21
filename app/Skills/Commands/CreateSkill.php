<?php

declare(strict_types=1);

namespace App\Skills\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Skills\Policies\SkillAuthoringPolicy;
use App\Skills\Values\SkillDraft;
use App\Skills\Values\SkillRevisionResult;

/**
 * A user stores a new skill under a user- key; its first revision is the draft. A retry under the same request id
 * answers the same result.
 *
 * @extends Command<SkillRevisionResult>
 */
#[Authorize(SkillAuthoringPolicy::class, AccessType::Create)]
final readonly class CreateSkill extends Command
{
    public function __construct(
        public string $key,
        public string $requestId,
        public SkillDraft $draft,
    ) {}
}
