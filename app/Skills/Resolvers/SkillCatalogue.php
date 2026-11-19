<?php

declare(strict_types=1);

namespace App\Skills\Resolvers;

use App\Skills\Contracts\Skill;
use App\Skills\Contracts\SkillResolver;
use App\Skills\Enums\SkillOrigin;
use App\Skills\Exceptions\SkillConditionInvalid;
use App\Skills\Exceptions\SkillConflict;
use App\Skills\Exceptions\SkillDeclarationInvalid;
use App\Skills\Exceptions\SkillMissing;
use App\Skills\Exceptions\SkillSourceInvalid;
use App\Skills\Support\CanonicalRenderer;
use App\Skills\Support\ConditionTree;
use App\Skills\Support\SkillRegistry;
use App\Skills\Support\StoredSkillSource;
use App\Skills\Values\SkillEntry;
use App\Skills\Values\SkillKey;
use App\Skills\Values\SkillOwner;
use Illuminate\Contracts\Container\Container;

/**
 * The checked catalogue of one request: every declared skill built through the container, its key checked against its
 * owner and every other key, its condition checked as a tree, and rendered; then every stored skill visible here.
 */
final readonly class SkillCatalogue implements SkillResolver
{
    /**
     * @param  array<string, SkillEntry>  $entries
     */
    private function __construct(
        private array $entries,
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
        $entries = [];

        foreach ($registry->owners() as $owner) {
            foreach ($owner->skills as $class) {
                /**
                 * @var Skill $skill
                 */
                $skill = $container->make($class);
                $key = SkillKey::from($skill->key());
                $owner->checkKey($key);

                if (array_key_exists($key->key, $entries)) {
                    throw SkillConflict::between($key->key, $entries[$key->key]->owner, $owner->name);
                }

                try {
                    $entries[$key->key] = new SkillEntry(
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
                    throw SkillDeclarationInvalid::inSkill($owner->name, $key->key, $invalid->getMessage());
                }
            }
        }

        $storedOwner = SkillOwner::stored();

        foreach ($stored->skills() as $skill) {
            $key = SkillKey::from($skill->key());

            if (array_key_exists($key->key, $entries)) {
                throw SkillConflict::between($key->key, $entries[$key->key]->owner, $storedOwner->name);
            }

            $entries[$key->key] = new SkillEntry(
                $key,
                $skill->name(),
                $storedOwner->name,
                SkillOrigin::Stored,
                $skill->description(),
                $skill->condition(),
                $skill->revisionNumber(),
                $renderer->render($skill, $storedOwner),
            );
        }

        return new self($entries);
    }

    public function all(): array
    {
        return array_values($this->entries);
    }

    public function find(SkillKey $key): SkillEntry
    {
        return $this->entries[$key->key] ?? throw SkillMissing::for($key);
    }
}
