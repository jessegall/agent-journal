<?php

declare(strict_types=1);

namespace App\Skills\Commands\RetireSkill;

use App\Bus\Contracts\CommandHandler;
use App\Models\Skills\Skill;
use App\Models\Skills\SkillRevision;
use App\Skills\Resolvers\Support\SkillContextResolver;
use App\Skills\StoredSkillWrites;
use App\Skills\Values\SkillRevisionResult;

final readonly class RetireSkillHandler implements CommandHandler
{
    public function __construct(private StoredSkillWrites $writes) {}

    public function handle(RetireSkillCommand $command): SkillRevisionResult
    {
        $skillId = $command->skill;

        return $this->writes->once($command->requestId, hash(
            'sha256',
            "retire|{$skillId}|{$command->expectedRevision}",
        ), function () use ($command, $skillId) {
            $skill = Skill::findLockedVisible($skillId, SkillContextResolver::ENVIRONMENT);
            $skill->assertWritableAt($command->expectedRevision);

            $skill->retireBy($this->writes->author());

            return SkillRevision::findCurrentOf($skill);
        });
    }
}
