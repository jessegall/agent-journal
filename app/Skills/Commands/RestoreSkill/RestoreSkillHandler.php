<?php

declare(strict_types=1);

namespace App\Skills\Commands\RestoreSkill;

use App\Bus\Contracts\CommandHandler;
use App\Models\Skills\Skill;
use App\Models\Skills\SkillRevision;
use App\Skills\Resolvers\Support\SkillContextResolver;
use App\Skills\StoredSkillWrites;
use App\Skills\Values\SkillRevisionResult;

final readonly class RestoreSkillHandler implements CommandHandler
{
    public function __construct(private StoredSkillWrites $writes) {}

    public function handle(RestoreSkillCommand $command): SkillRevisionResult
    {
        $skillId = $command->skill;

        return $this->writes->once($command->requestId, hash(
            'sha256',
            "{$skillId}|{$command->revision}|{$command->expectedRevision}",
        ), function () use ($command, $skillId) {
            $skill = Skill::findLockedVisible($skillId, SkillContextResolver::ENVIRONMENT);
            $skill->assertWritableAt($command->expectedRevision);
            $earlier = SkillRevision::findNumbered($skill, $command->revision);

            return $this->writes->restoreFrom(
                $skill,
                $earlier,
                $this->writes->checkedCondition($skill->key, $earlier->draft),
                $this->writes->author(),
            );
        });
    }
}
