<?php

declare(strict_types=1);

namespace App\Skills\Commands;

use App\Bus\Attributes\Operation;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Bus\Support\Command;
use App\Skills\Enums\ReadEvidence;
use App\Skills\Enums\SkillAbility;
use App\Skills\Handlers\RecordSkillReadHandler;
use App\Skills\Models\Skill;
use App\Skills\Policies\SkillAuthoringPolicy;

/**
 * Records that a session read one of its delivered skills whole, on proven evidence; answers whether it was recorded.
 *
 * @extends Command<bool>
 */
#[HandledBy(RecordSkillReadHandler::class)]
#[Authorize(SkillAuthoringPolicy::class, SkillAbility::Work)]
#[Operation('record_skill_read', ResourceAreaType::JournalContent, AccessType::Read)]
final readonly class RecordSkillRead extends Command implements HasAuthorizationSubject
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
