<?php

declare(strict_types=1);

namespace App\Skills\Handlers;

use App\Contracts\CommandHandler;
use App\Skills\Commands\RetireSkill;
use App\Skills\Models\Skill;
use App\Skills\Resolvers\Support\SkillContextResolver;
use App\Skills\Support\StoredSkillWrites;
use App\Skills\Values\SkillRevisionResult;

final readonly class RetireSkillHandler implements CommandHandler
{
    public function __construct(private StoredSkillWrites $writes) {}

    public function handle(RetireSkill $command): SkillRevisionResult
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
