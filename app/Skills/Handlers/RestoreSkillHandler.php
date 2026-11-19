<?php

declare(strict_types=1);

namespace App\Skills\Handlers;

use App\Contracts\CommandHandler;
use App\Skills\Commands\RestoreSkill;
use App\Skills\Models\Skill;
use App\Skills\Models\SkillRevision;
use App\Skills\Resolvers\Support\SkillContextResolver;
use App\Skills\Support\StoredSkillWrites;
use App\Skills\Values\SkillRevisionResult;

final readonly class RestoreSkillHandler implements CommandHandler
{
    public function __construct(
        private StoredSkillWrites $writes,
    ) {}

    public function handle(RestoreSkill $command): SkillRevisionResult
    {

        return $this->writes->once($command->requestId, hash('sha256', "{$command->skillId}|{$command->revision}|{$command->expectedRevision}"), function () use ($command) {
            $skill = Skill::lockVisible($command->skillId, SkillContextResolver::ENVIRONMENT);
            $skill->checkWritableAt($command->expectedRevision);
            $earlier = SkillRevision::numbered($skill, $command->revision);

            return $skill->restoreFrom($earlier, $this->writes->checkedCondition($skill->key, $earlier->draft()), $this->writes->author());
        });
    }
}
