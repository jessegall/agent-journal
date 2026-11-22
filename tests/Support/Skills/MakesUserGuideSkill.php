<?php

declare(strict_types=1);

namespace Tests\Support\Skills;

use App\Contracts\Work\AgentStack;
use App\Support\SkillPublishing;
use Domain\Access\Support\AccessSettings;
use Tests\Fixtures\Skills\RecordingStack;
use Tests\Support\TestActors;

/**
 * The skill user-guide, made by user 7 on a recording stack and published before each test.
 */
trait MakesUserGuideSkill
{
    protected function setUpMakesUserGuideSkill(): void
    {
        $this->app->instance(AccessSettings::class, TestActors::accessSettings(7));
        $this->app->instance(AgentStack::class, new RecordingStack());
        $this->artisan('skill:make', [
            'key' => 'user-guide',
            '--description' => 'The guide',
            '--body' => <<<'TEXT'
            # Guide

            First text.

            TEXT,
        ])->assertSuccessful();
        $this->app->make(SkillPublishing::class)->refresh();
    }
}
