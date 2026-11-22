<?php

declare(strict_types=1);

namespace App\Commands\RetireSkill;

use App\Contracts\CommandHandler;
use App\Models\Skill;
use App\Resolvers\Support\SkillContextResolver;
use App\Support\StoredSkillWrites;
use App\Values\SkillRevisionResult;

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
            $skill = Skill::lockVisible($skillId, SkillContextResolver::ENVIRONMENT);
            $skill->assertWritableAt($command->expectedRevision);

            return $skill->retireBy($this->writes->author());
        });
    }
}
