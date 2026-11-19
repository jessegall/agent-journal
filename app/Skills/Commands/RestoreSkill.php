<?php

declare(strict_types=1);

namespace App\Skills\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use App\Skills\Handlers\RestoreSkillHandler;
use App\Skills\Values\SkillRevisionResult;

/**
 * A user restores an earlier revision's content as a new revision, checked against today's rules; history stays.
 *
 * @implements Command<SkillRevisionResult>
 */
#[HandledBy(RestoreSkillHandler::class)]
final readonly class RestoreSkill implements Command
{
    public function __construct(
        public string $skillId,
        public int $revision,
        public int $expectedRevision,
        public string $requestId,
    ) {}
}
