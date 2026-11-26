<?php

declare(strict_types=1);

namespace App\Skills\Commands\AskSkillRead;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Policies\SkillPolicy;
use App\Support\Command;

/**
 * Asks a session's agent to read skills its start handed it whole; answers the keys it was asked to read.
 *
 * @extends Command<list<string>>
 */
#[Authorize(SkillPolicy::class, AccessType::Read)]
final readonly class AskSkillReadCommand extends Command
{
    /**
     * @param  list<string>  $skillKeys
     */
    public function __construct(
        public string $sessionId,
        public array $skillKeys,
    ) {}
}
