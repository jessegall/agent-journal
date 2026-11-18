<?php

declare(strict_types=1);

namespace App\Skills\Values;

use App\Skills\Contracts\Skill;

/**
 * Core, a domain or a module as a supplier of skills: its name, the root folder its resources/skills lie under, and
 * the classes of the skills it declares.
 */
final readonly class SkillOwner
{
    /**
     * @param  list<class-string<Skill>>  $skills
     */
    public function __construct(
        public string $name,
        public string $sourceRoot,
        public array $skills,
    ) {}

    /**
     * The folder its Markdown parts and assets are read from.
     */
    public function skillsFolder(): string
    {
        return $this->sourceRoot.'/resources/skills';
    }
}
