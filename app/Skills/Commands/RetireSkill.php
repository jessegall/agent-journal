<?php

declare(strict_types=1);

namespace App\Skills\Commands;

use App\Actors\Enums\ActorType;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RequiresActor;
use App\Bus\Contracts\Command;
use App\Skills\Handlers\RetireSkillHandler;
use App\Skills\Values\SkillRevisionResult;

/**
 * The owner retires a stored skill: no selection offers it again, and its revisions stay readable.
 *
 * @implements Command<SkillRevisionResult>
 */
#[HandledBy(RetireSkillHandler::class)]
#[RequiresActor(ActorType::User)]
final readonly class RetireSkill implements Command
{
    public function __construct(
        public string $skillId,
        public int $expectedRevision,
        public string $requestId,
    ) {}
}
