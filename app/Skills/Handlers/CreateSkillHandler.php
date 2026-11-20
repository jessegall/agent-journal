<?php

declare(strict_types=1);

namespace App\Skills\Handlers;

use App\Contracts\CommandHandler;
use App\Skills\Commands\CreateSkill;
use App\Skills\Exceptions\SkillDeclarationInvalid;
use App\Skills\Exceptions\SkillKeyTaken;
use App\Skills\Models\Skill;
use App\Skills\Resolvers\Support\SkillContextResolver;
use App\Skills\Support\SkillAuthoring;
use App\Skills\Support\StoredSkillWrites;
use App\Skills\Values\SkillDraft;
use App\Skills\Values\SkillDraftText;
use App\Skills\Values\SkillKey;
use App\Skills\Values\SkillOwner;
use App\Skills\Values\SkillRevisionResult;

final readonly class CreateSkillHandler implements CommandHandler
{
    public function __construct(
        private StoredSkillWrites $writes,
        private SkillAuthoring $authoring,
    ) {}

    public function handle(CreateSkill $command): SkillRevisionResult
    {
        $key = SkillKey::from($command->key);
        $draft = $command->draft instanceof SkillDraftText ? new SkillDraft(
            $command->draft->name,
            $command->draft->description,
            $this->authoring->sectionsOf($command->draft->body),
            $command->draft->condition,
        ) : $command->draft;

        return $this->writes->once($command->requestId, hash(
            'sha256',
            $key->key.'|'.$draft->digest(),
        ), function () use ($key, $draft) {
            if (! $key->isUserAuthored()) {
                throw SkillDeclarationInvalid::reservedKey(SkillOwner::STORED, $key->key);
            }

            if (Skill::keyTaken($key)) {
                throw SkillKeyTaken::for($key->key);
            }

            $condition = $this->writes->checkedCondition($key->key, $draft);
            $author = $this->writes->author();

            return Skill::start(
                $key,
                $author,
                SkillContextResolver::ENVIRONMENT,
            )->appendRevision($draft, $condition, $author);
        });
    }
}
