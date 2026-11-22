<?php

declare(strict_types=1);

namespace App\Commands\RecordSkillRead;

use App\Attributes\Authorize;
use App\Enums\AccessType;
use App\Enums\ReadEvidence;
use App\Policies\SkillPolicy;
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
