<?php

declare(strict_types=1);

namespace App\Skills\Commands\RecordSkillRead;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Policies\SkillPolicy;
use App\Skills\Enums\ReadEvidence;
use App\Support\Command;

/**
 * Records that a session read one of its delivered skills whole, on proven evidence; answers whether it was recorded.
 *
 * @extends Command<bool>
 */
#[Authorize(SkillPolicy::class, AccessType::Read)]
final readonly class RecordSkillReadCommand extends Command
{
    public function __construct(
        public string $sessionId,
        public string $skillKey,
        public ReadEvidence $evidence,
    ) {}
}
