<?php

declare(strict_types=1);

namespace App\Skills\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Skills\Handlers\RestoreSkillHandler;
use App\Skills\Policies\SkillAuthoringPolicy;
use App\Skills\Values\SkillRevisionResult;

/**
 * A user restores an earlier revision's content as a new revision, checked against today's rules; history stays.
 *
 * @extends Command<SkillRevisionResult>
 */
#[HandledBy(RestoreSkillHandler::class)]
#[Authorize(SkillAuthoringPolicy::class, AccessType::Edit)]
final readonly class RestoreSkill extends Command
{
    public function __construct(
        public string $skill,
        public int $revision,
        public int $expectedRevision,
        public string $requestId,
    ) {}
}
