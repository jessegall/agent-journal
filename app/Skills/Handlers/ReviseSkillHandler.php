<?php

declare(strict_types=1);

namespace App\Skills\Handlers;

use App\Contracts\CommandHandler;
use App\Skills\Commands\ReviseSkill;
use App\Skills\Models\Skill;
use App\Skills\Readers\Support\SkillContextReader;
use App\Skills\Support\StoredSkillWrites;
use App\Skills\Values\SkillRevisionResult;

final readonly class ReviseSkillHandler implements CommandHandler
{
    public function __construct(
        private StoredSkillWrites $writes,
    ) {}

    public function handle(ReviseSkill $command): SkillRevisionResult
    {
        return $this->writes->once($command->requestId, hash('sha256', "{$command->skillId}|{$command->expectedRevision}|".$command->draft->digest()), function () use ($command) {
            $skill = Skill::lockVisible($command->skillId, SkillContextReader::ENVIRONMENT);
            $skill->checkWritableAt($command->expectedRevision);

            return $skill->appendRevision($command->draft, $this->writes->checkedCondition($skill->key, $command->draft), $this->writes->author());
        });
    }
}
