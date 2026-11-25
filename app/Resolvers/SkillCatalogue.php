<?php

declare(strict_types=1);

namespace App\Resolvers;

use App\Contracts\Skills\Skill;
use App\Contracts\Skills\SkillResolver;
use App\Enums\Skills\SkillOrigin;
use App\Exceptions\SkillConditionInvalid;
use App\Exceptions\SkillConflict;
use App\Exceptions\SkillDeclarationInvalid;
use App\Exceptions\SkillMissing;
use App\Exceptions\SkillSourceInvalid;
use App\Support\CanonicalRenderer;
use App\Support\ConditionTree;
use App\Support\SkillRegistry;
use App\Support\StoredSkillSource;
use App\Values\SkillEntry;
use App\Values\SkillKey;
use App\Values\SkillOwner;
use Illuminate\Contracts\Container\Container;

/**
 * The checked catalogue of one request: every declared skill built through the container, its key checked against its
 * owner and every other key, its condition checked as a tree, and rendered; then every stored skill visible here.
 */
final readonly class SkillCatalogue implements SkillResolver
{
    /**
     * @param  array<string, SkillEntry>  $skillsByKey
     */
    private function __construct(
        private array $skillsByKey,
    ) {}

    /**
     * @throws SkillConflict when two owners declare one key
     * @throws SkillDeclarationInvalid when a shipped skill's condition, sections or text are invalid, naming its owner
     *                                 and key
     */
    public static function build(
        SkillRegistry $registry,
        Container $container,
        CanonicalRenderer $renderer,
        ConditionTree $conditions,
        StoredSkillSource $stored,
    ): self {
        $skillsByKey = [];

        foreach ($registry->owners() as $owner) {
            foreach ($owner->skills as $class) {
                /**
                 * @var Skill $skill
                 */
                $skill = $container->make($class);
                $key = SkillKey::from($skill->key());
                $owner->checkKey($key);

                if (array_key_exists($key->key, $skillsByKey)) {
                    throw SkillConflict::between($key->key, $skillsByKey[$key->key]->owner, $owner->name);
                }

                try {
                    $skillsByKey[$key->key] = new SkillEntry(
                        $key,
                        $skill->name(),
                        $owner->name,
                        SkillOrigin::Shipped,
                        $skill->description(),
                        $conditions->check($skill->condition()),
                        null,
                        $renderer->render($skill, $owner),
                    );
                } catch (SkillSourceInvalid|SkillConditionInvalid|SkillDeclarationInvalid $invalid) {
                    throw SkillDeclarationInvalid::inSkill($owner->name, $key->key, $invalid);
                }
            }
        }

        $storedOwner = SkillOwner::stored();

        foreach ($stored->skills() as $storedSkill) {
            $key = SkillKey::from($storedSkill->key());

            if (array_key_exists($key->key, $skillsByKey)) {
                throw SkillConflict::between($key->key, $skillsByKey[$key->key]->owner, $storedOwner->name);
            }

            $skillsByKey[$key->key] = new SkillEntry(
                $key,
                $storedSkill->name(),
                $storedOwner->name,
                SkillOrigin::Stored,
                $storedSkill->description(),
                $storedSkill->condition(),
                $storedSkill->revisionNumber(),
                $renderer->render($storedSkill, $storedOwner),
            );
        }

        return new self($skillsByKey);
    }

    public function all(): array
    {
        return array_values($this->skillsByKey);
    }

    public function find(SkillKey $key): SkillEntry
    {
        return $this->skillsByKey[$key->key] ?? throw SkillMissing::for($key);
    }
}
