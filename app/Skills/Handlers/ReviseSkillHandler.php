<?php

declare(strict_types=1);

namespace App\Skills\Handlers;

use App\Contracts\CommandHandler;
use App\Skills\Commands\ReviseSkill;
use App\Skills\Models\Skill;
use App\Skills\Resolvers\Support\SkillContextResolver;
use App\Skills\Support\SkillAuthoring;
use App\Skills\Support\StoredSkillWrites;
use App\Skills\Values\SkillDraftChanges;
use App\Skills\Values\SkillRevisionResult;

final readonly class ReviseSkillHandler implements CommandHandler
{
    public function __construct(
        private StoredSkillWrites $writes,
        private SkillAuthoring $authoring,
    ) {}

    public function handle(ReviseSkill $command): SkillRevisionResult
    {
        $skillId = $this->authoring->storedId($command->skill);
        return $this->writes->once($command->requestId, hash(
            'sha256',
            "{$skillId}|{$command->expectedRevision}|".$command->draft->digest(),
        ), function () use ($command, $skillId) {
            $skill = Skill::lockVisible($skillId, SkillContextResolver::ENVIRONMENT);
            $skill->checkWritableAt($command->expectedRevision);
            $draft = $command->draft instanceof SkillDraftChanges
                ? $this->authoring->revisedDraft($skill, $command->draft)
                : $command->draft;

            return $skill->appendRevision(
                $draft,
                $this->writes->checkedCondition($skill->key, $draft),
                $this->writes->author(),
            );
        });
    }
}
