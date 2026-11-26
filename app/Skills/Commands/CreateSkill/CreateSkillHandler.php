<?php

declare(strict_types=1);

namespace App\Skills\Commands\CreateSkill;

use App\Bus\Contracts\CommandHandler;
use App\Models\Skills\Skill;
use App\Skills\Exceptions\SkillDeclarationInvalid;
use App\Skills\Exceptions\SkillKeyTaken;
use App\Skills\Resolvers\Support\SkillContextResolver;
use App\Skills\StoredSkillWrites;
use App\Skills\Values\SkillRevisionResult;
use App\Values\SkillKey;
use App\Values\SkillOwner;

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

            if (Skill::isKeyTaken($key)) {
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
