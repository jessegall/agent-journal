<?php

declare(strict_types=1);

namespace App\Skills\Values;

use App\Skills\Contracts\Skill;
use App\Skills\Exceptions\SkillDeclarationInvalid;
use Illuminate\Support\Str;

/**
 * Core, a domain or a module as a supplier of skills: its name, the root folder its resources/skills lie under, the
 * classes of the skills it declares, and whether it is first-party (Core or a package in domain/) or a module.
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
        public bool $firstParty,
    ) {}

    /**
     * The folder its Markdown parts and assets are read from.
     */
    public function skillsFolder(): string
    {
        return $this->sourceRoot.'/resources/skills';
    }

    /**
     * The prefix a module's skill keys start with: its name in lowercase words joined by hyphens.
     */
    public function slug(): string
    {
        return Str::kebab($this->name);
    }

    /**
     * Refuses a key this owner may not declare: user- keys belong to stored skills, journal- keys to first-party
     * owners, and a module's keys start with its slug.
     *
     * @throws SkillDeclarationInvalid
     */
    public function checkKey(SkillKey $key): void
    {
        $allowed = match (true) {
            $key->isUserAuthored() => false,
            $this->firstParty => true,
            default => ! $key->isFirstParty() && $key->hasPrefix($this->slug()),
        };

        if (! $allowed) {
            throw SkillDeclarationInvalid::reservedKey($this->name, $key->key);
        }
    }
}
