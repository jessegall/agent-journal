<?php

declare(strict_types=1);

namespace App\Skills\Support;

use App\Skills\Values\SkillOwner;

/**
 * Every owner of skills by name, Core's first and then the domains and modules in registration order: class names and
 * folders only, never a built skill, so it can live as long as the application.
 */
final readonly class SkillRegistry
{
    /**
     * @param  array<string, SkillOwner>  $owners
     */
    private function __construct(
        private array $owners,
    ) {}

    /**
     * @param  list<SkillOwner>  $owners
     */
    public static function of(array $owners): self
    {
        $byName = [];

        foreach ($owners as $owner) {
            $byName[$owner->name] = $owner;
        }

        return new self($byName);
    }

    /**
     * @return list<SkillOwner>
     */
    public function owners(): array
    {
        return array_values($this->owners);
    }
}
