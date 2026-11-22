<?php

declare(strict_types=1);

namespace App\Skills\Commands\ReviseSkill;

use App\Contracts\CommandHandler;
use App\Skills\Models\Skill;
use App\Skills\Resolvers\Support\SkillContextResolver;
use App\Skills\Support\StoredSkillWrites;
use App\Skills\Values\SkillRevisionResult;

final readonly class ReviseSkillHandler implements CommandHandler
{
    public function __construct(private StoredSkillWrites $writes) {}

    public function handle(ReviseSkillCommand $command): SkillRevisionResult
    {
        $skillId = $command->skill;

        return $this->writes->once($command->requestId, hash(
            'sha256',
            "{$skillId}|{$command->expectedRevision}|".$command->draft->digest(),
        ), function () use ($command, $skillId) {
            $skill = Skill::lockVisible($skillId, SkillContextResolver::ENVIRONMENT);
            $skill->assertWritableAt($command->expectedRevision);
            $draft = $command->draft;

            return $this->writes->appendRevision(
                $skill,
                $draft,
                $this->writes->checkedCondition($skill->key, $draft),
                $this->writes->author(),
            );
        });
    }
}
