<?php

declare(strict_types=1);

namespace Tests\Support\Skills;

use App\Support\SkillPublishingService;

/**
 * The shipped skills published into a temporary folder before each test.
 */
trait PublishesSkills
{
    use HasSkillTargets;

    protected function setUpPublishesSkills(): void
    {
        $this->setUpHasSkillTargets();
        $this->app->make(SkillPublishingService::class)->refresh();
    }
}
