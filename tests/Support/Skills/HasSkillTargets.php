<?php

declare(strict_types=1);

namespace Tests\Support\Skills;

use App\Skills\Support\SkillTargets;
use Tests\Support\UsesTemporaryFolder;

/**
 * A temporary folder the skills are published into, in place of the agents' real skill folders.
 */
trait HasSkillTargets
{
    use UsesTemporaryFolder;

    protected function setUpHasSkillTargets(): void
    {
        if (isset($this->root)) {
            return;
        }

        $this->makeTemporaryFolder('journal-skills');
        $this->app->instance(SkillTargets::class, new SkillTargets($this->root));
    }
}
