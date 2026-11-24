<?php

declare(strict_types=1);

namespace App\Commands\Skills\ReviseSkill;

use App\Contracts\Bus\CommandHandler;
use App\Models\Skills\Skill;
use App\Resolvers\Support\SkillContextResolver;
use App\Support\StoredSkillWrites;
use App\Values\SkillRevisionResult;

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
