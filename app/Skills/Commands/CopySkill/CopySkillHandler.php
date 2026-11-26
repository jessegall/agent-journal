<?php

declare(strict_types=1);

namespace App\Skills\Commands\CopySkill;

use App\Bus\Contracts\CommandHandler;
use App\Models\Skills\Skill;
use App\Skills\Contracts\SkillResolver;
use App\Skills\Exceptions\SkillDeclarationInvalid;
use App\Skills\Exceptions\SkillKeyTaken;
use App\Skills\Resolvers\Support\SkillContextResolver;
use App\Skills\StoredSkillWrites;
use App\Skills\Values\SkillRevisionResult;
use App\Values\SkillKey;
use App\Values\SkillOwner;

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

            if (Skill::isKeyTaken($key)) {
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
