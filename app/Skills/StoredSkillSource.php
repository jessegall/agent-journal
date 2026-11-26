<?php

declare(strict_types=1);

namespace App\Skills;

use App\Models\Skills\Skill;
use App\Models\Skills\SkillRevision;
use App\Skills\Resolvers\Support\SkillContextResolver;

/**
 * The current revision of every unretired stored skill visible in this environment, read in two queries.
 */
final readonly class StoredSkillSource
{
    private const int MOST_SKILLS = 1_000;

    public function __construct(
        private ConditionTree $conditions,
    ) {}

    /**
     * @return list<StoredSkill>
     */
    public function skills(): array
    {
        $skills = Skill::findActiveIn(SkillContextResolver::ENVIRONMENT, self::MOST_SKILLS);
        $revisions = SkillRevision::findCurrentOfEach($skills);

        return array_values(array_map(
            fn (Skill $skill) => new StoredSkill(
                $skill->key,
                $revisions[$skill->id],
                $revisions[$skill->id]->conditionThrough($this->conditions),
            ),
            array_filter($skills, fn (Skill $skill) => array_key_exists($skill->id, $revisions)),
        ));
    }
}
