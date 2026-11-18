<?php

declare(strict_types=1);

namespace App\Skills\Contracts;

use App\Skills\Values\RenderedSkill;
use App\Skills\Values\SkillOwner;

/**
 * Renders a skill to the exact Markdown bytes a program reads, resolving its Markdown parts in its owner's folder.
 */
interface SkillRenderer
{
    public function render(Skill $skill, SkillOwner $owner): RenderedSkill;
}
