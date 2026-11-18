<?php

declare(strict_types=1);

namespace App\Skills\Handlers;

use App\Contracts\CommandHandler;
use App\Skills\Commands\RecordSkillRead;
use App\Skills\Support\SkillReads;

final readonly class RecordSkillReadHandler implements CommandHandler
{
    public function __construct(
        private SkillReads $reads,
    ) {}

    public function handle(RecordSkillRead $command): bool
    {
        return $this->reads->record($command->sessionId, $command->skillKey, $command->evidence);
    }
}
