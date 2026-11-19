<?php

declare(strict_types=1);

namespace App\Skills\Handlers;

use App\Contracts\CommandHandler;
use App\Skills\Commands\CopySkill;
use App\Skills\Contracts\SkillResolver;
use App\Skills\Exceptions\SkillDeclarationInvalid;
use App\Skills\Exceptions\SkillKeyTaken;
use App\Skills\Models\Skill;
use App\Skills\Resolvers\Support\SkillContextResolver;
use App\Skills\Support\StoredSkillWrites;
use App\Skills\Values\SkillKey;
use App\Skills\Values\SkillOwner;
use App\Skills\Values\SkillRevisionResult;

final readonly class CopySkillHandler implements CommandHandler
{
    public function __construct(
        private StoredSkillWrites $writes,
        private SkillResolver $skills,
    ) {}

    public function handle(CopySkill $command): SkillRevisionResult
    {
        $key = SkillKey::from($command->key);

        return $this->writes->once($command->requestId, hash('sha256', "copy|{$command->sourceKey}|{$key->key}"), function () use ($key, $command) {
            if (! $key->isUserAuthored()) {
                throw SkillDeclarationInvalid::reservedKey(SkillOwner::STORED, $key->key);
            }

            if (Skill::keyTaken($key)) {
                throw SkillKeyTaken::for($key->key);
            }

            $source = $this->skills->find(SkillKey::from($command->sourceKey));
            $draft = $source->copyDraft();
            $author = $this->writes->author();

            return Skill::start($key, $author, SkillContextResolver::ENVIRONMENT)->appendRevision($draft, $this->writes->checkedCondition($key->key, $draft), $author, $source->key->key, $source->rendered->digest);
        });
    }
}
