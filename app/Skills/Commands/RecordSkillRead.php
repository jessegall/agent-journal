<?php

declare(strict_types=1);

namespace App\Skills\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Skills\Enums\ReadEvidence;
use App\Skills\Enums\SkillAbility;
use App\Skills\Handlers\RecordSkillReadHandler;
use App\Skills\Models\Skill;
use App\Skills\Policies\SkillAuthoringPolicy;

/**
 * Records that a session read one of its delivered skills whole, on proven evidence; answers whether it was recorded.
 *
 * @implements Command<bool>
 */
#[HandledBy(RecordSkillReadHandler::class)]
#[Authorize(SkillAuthoringPolicy::class, SkillAbility::Work)]
final readonly class RecordSkillRead implements Command, HasAuthorizationSubject
{
    public function __construct(
        public string $sessionId,
        public string $skillKey,
        public ReadEvidence $evidence,
    ) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return Skill::class;
    }
}
