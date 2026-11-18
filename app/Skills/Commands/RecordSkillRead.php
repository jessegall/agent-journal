<?php

declare(strict_types=1);

namespace App\Skills\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use App\Skills\Enums\ReadEvidence;
use App\Skills\Handlers\RecordSkillReadHandler;

/**
 * Records that a session read one of its delivered skills whole, on proven evidence; answers whether it was recorded.
 *
 * @implements Command<bool>
 */
#[HandledBy(RecordSkillReadHandler::class)]
final readonly class RecordSkillRead implements Command
{
    public function __construct(
        public string $sessionId,
        public string $skillKey,
        public ReadEvidence $evidence,
    ) {}
}
