<?php

declare(strict_types=1);

namespace App\Skills\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use App\Skills\Handlers\ReviseSkillHandler;
use App\Skills\Values\SkillDraft;
use App\Skills\Values\SkillRevisionResult;

/**
 * A user saves a new revision of a stored skill, against the revision they read; a save against an older one is
 * refused.
 *
 * @implements Command<SkillRevisionResult>
 */
#[HandledBy(ReviseSkillHandler::class)]
final readonly class ReviseSkill implements Command
{
    public function __construct(
        public string $skillId,
        public int $expectedRevision,
        public string $requestId,
        public SkillDraft $draft,
    ) {}
}
