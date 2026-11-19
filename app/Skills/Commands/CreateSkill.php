<?php

declare(strict_types=1);

namespace App\Skills\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use App\Skills\Handlers\CreateSkillHandler;
use App\Skills\Values\SkillDraft;
use App\Skills\Values\SkillRevisionResult;

/**
 * A user stores a new skill under a user- key; its first revision is the draft. A retry under the same request id
 * answers the same result.
 *
 * @implements Command<SkillRevisionResult>
 */
#[HandledBy(CreateSkillHandler::class)]
final readonly class CreateSkill implements Command
{
    public function __construct(
        public string $key,
        public string $requestId,
        public SkillDraft $draft,
    ) {}
}
