<?php

declare(strict_types=1);

namespace App\Commands\Skills\CopySkill;

use App\Contracts\Bus\CommandHandler;
use App\Contracts\Skills\SkillResolver;
use App\Exceptions\SkillDeclarationInvalid;
use App\Exceptions\SkillKeyTaken;
use App\Models\Skills\Skill;
use App\Resolvers\Support\SkillContextResolver;
use App\Support\StoredSkillWrites;
use App\Values\SkillKey;
use App\Values\SkillOwner;
use App\Values\SkillRevisionResult;

final readonly class CopySkillHandler implements CommandHandler
{
    public function __construct(
        private StoredSkillWrites $writes,
        private SkillResolver $skills,
    ) {}

    public function handle(CopySkillCommand $command): SkillRevisionResult
    {
        $key = SkillKey::from($command->key);

        return $this->writes->once($command->requestId, hash(
            'sha256',
            "copy|{$command->sourceKey}|{$key->key}",
        ), function () use ($key, $command) {
            if (! $key->isUserAuthored()) {
                throw SkillDeclarationInvalid::reservedKey(SkillOwner::STORED, $key->key);
            }

            if (Skill::keyTaken($key)) {
                throw SkillKeyTaken::for($key->key);
            }

            $source = $this->skills->find(SkillKey::from($command->sourceKey));
            $draft = $source->copyDraft();
            $author = $this->writes->author();

            return $this->writes->appendRevision(
                Skill::create($key, $author, SkillContextResolver::ENVIRONMENT),
                $draft,
                $this->writes->checkedCondition($key->key, $draft),
                $author,
                $source->key->key,
                $source->rendered->digest,
            );
        });
    }
}
