<?php

declare(strict_types=1);

namespace App\Skills\Commands\RecordSkillRead;

use App\Bus\Contracts\CommandHandler;
use App\Skills\SkillReads;

final readonly class RecordSkillReadHandler implements CommandHandler
{
    public function __construct(
        private SkillReads $reads,
    ) {}

    public function handle(RecordSkillReadCommand $command): bool
    {
        return $this->reads->record($command->sessionId, $command->skillKey, $command->evidence);
    }
}
