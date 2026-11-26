<?php

declare(strict_types=1);

namespace App\Skills;

use App\Skills\Exceptions\SkillConditionConflict;
use App\Skills\Values\SkillConditionDefinition;

/**
 * Every named condition type the installed domains and modules register, by key, with the owner that registered it.
 */
final readonly class ConditionRegistry
{
    /**
     * @param  array<string, SkillConditionDefinition>  $definitions
     */
    private function __construct(private array $definitions) {}

    /**
     * @param  array<string, list<SkillConditionDefinition>>  $byOwner  each owner's definitions, by owner name
     *
     * @throws SkillConditionConflict when two owners register one key
     */
    public static function of(array $byOwner): self
    {
        $definitions = [];
        $owners = [];

        foreach ($byOwner as $owner => $ownRegistrations) {
            foreach ($ownRegistrations as $definition) {
                if (array_key_exists($definition->key, $definitions)) {
                    throw SkillConditionConflict::between($definition->key, $owners[$definition->key], $owner);
                }

                $definitions[$definition->key] = $definition;
                $owners[$definition->key] = $owner;
            }
        }

        return new self($definitions);
    }

    public function has(string $key): bool
    {
        return array_key_exists($key, $this->definitions);
    }

    /**
     * The registration of an installed key; callers ask has() first.
     */
    public function definition(string $key): SkillConditionDefinition
    {
        return $this->definitions[$key];
    }
}
