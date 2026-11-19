<?php

declare(strict_types=1);

namespace App\Skills\Handlers;

use App\Contracts\CommandHandler;
use App\Skills\Commands\CreateSkill;
use App\Skills\Exceptions\SkillDeclarationInvalid;
use App\Skills\Exceptions\SkillKeyTaken;
use App\Skills\Models\Skill;
use App\Skills\Resolvers\Support\SkillContextResolver;
use App\Skills\Support\StoredSkillWrites;
use App\Skills\Values\SkillKey;
use App\Skills\Values\SkillOwner;
use App\Skills\Values\SkillRevisionResult;

final readonly class CreateSkillHandler implements CommandHandler
{
    public function __construct(
        private StoredSkillWrites $writes,
    ) {}

    public function handle(CreateSkill $command): SkillRevisionResult
    {
        $key = SkillKey::from($command->key);

        return $this->writes->once($command->requestId, hash(
            'sha256',
            $key->key.'|'.$command->draft->digest(),
        ), function () use ($key, $command) {
            if (! $key->isUserAuthored()) {
                throw SkillDeclarationInvalid::reservedKey(SkillOwner::STORED, $key->key);
            }

            if (Skill::keyTaken($key)) {
                throw SkillKeyTaken::for($key->key);
            }

            $condition = $this->writes->checkedCondition($key->key, $command->draft);
            $author = $this->writes->author();

            return Skill::start(
                $key,
                $author,
                SkillContextResolver::ENVIRONMENT,
            )->appendRevision($command->draft, $condition, $author);
        });
    }
}
