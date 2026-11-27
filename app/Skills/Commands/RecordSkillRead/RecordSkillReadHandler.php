<?php

declare(strict_types=1);

namespace App\Skills\Commands\RecordSkillRead;

use App\Bus\Contracts\CommandHandler;
use App\Models\Agents\AgentSession;
use App\Models\Skills\SkillReadEntry;

final readonly class RecordSkillReadHandler implements CommandHandler
{
    public function handle(RecordSkillReadCommand $command): bool
    {
        $session = AgentSession::findById($command->sessionId);

        if (! $session->hasSkill($command->skillKey)) {
            return false;
        }

        SkillReadEntry::create($session, $command->skillKey, $command->evidence);

        return true;
    }
}
