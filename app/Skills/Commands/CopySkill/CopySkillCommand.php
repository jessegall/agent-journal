<?php

declare(strict_types=1);

namespace App\Skills\Commands\CopySkill;

use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Skills\Policies\SkillAuthoringPolicy;
use App\Skills\Values\SkillRevisionResult;

/**
 * A user copies a skill they may read, shipped or stored, into a new stored skill under a user- key: the copied text
 * is a snapshot with its source key and digest, never a live include.
 *
 * @extends Command<SkillRevisionResult>
 */
#[Authorize(SkillAuthoringPolicy::class, AccessType::Create)]
final readonly class CopySkillCommand extends Command
{
    public function __construct(
        public string $sourceKey,
        public string $key,
        public string $requestId,
    ) {}
}
