<?php

declare(strict_types=1);

namespace App\Skills\Commands\AskSkillRead;

use App\Bus\Contracts\CommandHandler;
use App\Models\Agents\AgentSession;
use App\Skills\Exceptions\SkillReadRefused;
use App\Skills\SkillReadAsks;
use App\Skills\Values\AskedSkillReads;

final readonly class AskSkillReadHandler implements CommandHandler
{
    public function __construct(
        private SkillReadAsks $asks,
    ) {}

    /**
     * @throws SkillReadRefused
     */
    public function handle(AskSkillReadCommand $command): AskedSkillReads
    {
        $session = AgentSession::findById($command->sessionId);

        if (! $session->isActive()) {
            throw SkillReadRefused::sessionEnded($session->id);
        }

        foreach ($command->skillKeys as $key) {
            if (! $session->hasSkill($key)) {
                throw SkillReadRefused::notHanded($key);
            }
        }

        $this->asks->ask($session->target, $command->skillKeys);

        return new AskedSkillReads($command->skillKeys);
    }
}
