<?php

declare(strict_types=1);

namespace App\Commands\CreateSkill;

use App\Contracts\Bus\CommandHandler;
use App\Exceptions\SkillDeclarationInvalid;
use App\Exceptions\SkillKeyTaken;
use App\Models\Skill;
use App\Resolvers\Support\SkillContextResolver;
use App\Support\StoredSkillWrites;
use App\Values\SkillKey;
use App\Values\SkillOwner;
use App\Values\SkillRevisionResult;

final readonly class CreateSkillHandler implements CommandHandler
{
    public function __construct(private StoredSkillWrites $writes) {}

    public function handle(CreateSkillCommand $command): SkillRevisionResult
    {
        $key = SkillKey::from($command->key);
        $draft = $command->draft;

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

            return $this->writes->appendRevision(
                Skill::create($key, $author, SkillContextResolver::ENVIRONMENT),
                $draft,
                $condition,
                $author,
            );
        });
    }
}
