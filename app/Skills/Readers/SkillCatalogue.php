<?php

declare(strict_types=1);

namespace App\Skills\Readers;

use App\Skills\Contracts\Skill;
use App\Skills\Contracts\SkillReader;
use App\Skills\Contracts\SkillRenderer;
use App\Skills\Enums\SkillOrigin;
use App\Skills\Exceptions\SkillConflict;
use App\Skills\Exceptions\SkillMissing;
use App\Skills\Support\SkillRegistry;
use App\Skills\Values\SkillEntry;
use App\Skills\Values\SkillKey;
use Illuminate\Contracts\Container\Container;

/**
 * The checked catalogue of one request: every declared skill built through the container, its key checked against its
 * owner and every other key, and rendered.
 */
final readonly class SkillCatalogue implements SkillReader
{
    /**
     * @param  array<string, SkillEntry>  $entries
     */
    private function __construct(
        private array $entries,
    ) {}

    /**
     * @throws SkillConflict when two owners declare one key
     */
    public static function build(SkillRegistry $registry, Container $container, SkillRenderer $renderer): self
    {
        $entries = [];

        foreach ($registry->owners() as $owner) {
            foreach ($owner->skills as $class) {
                /** @var Skill $skill */
                $skill = $container->make($class);
                $key = SkillKey::from($skill->key());
                $owner->checkKey($key);

                if (array_key_exists($key->key, $entries)) {
                    throw SkillConflict::between($key->key, $entries[$key->key]->owner, $owner->name);
                }

                $entries[$key->key] = new SkillEntry($key, $skill->name(), $owner->name, SkillOrigin::Shipped, $skill->description(), $renderer->render($skill, $owner));
            }
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
