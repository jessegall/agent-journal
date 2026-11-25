<?php

declare(strict_types=1);

namespace Tests\Support\Skills;

use App\Data\Skills\GeneratedSkillData;
use App\Enums\Skills\GenerationState;
use App\Models\Skills\SkillGeneration;
use App\Models\Skills\SkillPublication;
use App\Support\SkillPublications;
use Tests\Support\TestIds;

/**
 * An intended publication of a one-skill generation into test user 1's Claude Code folder under the test's skill
 * targets; the test keeps those targets in its $root folder.
 */
trait IntendsSkillPublications
{
    private function intend(string $text): SkillPublication
    {
        $markdown = <<<TEXT
        # Journal

        {$text}

        TEXT;
        $generation = SkillGeneration::create(str_repeat('e', 64), GenerationState::Ready, hash('sha256', $text), GeneratedSkillData::collect([
            [
                'key' => 'journal',
                'owner' => 'Core',
                'revision' => null,
                'markdown' => $markdown,
                'digest' => hash('sha256', $markdown),
            ],
        ]), null);

        return $this->app->make(SkillPublications::class)->intend(
            TestIds::of(1),
            'claude-code',
            $this->target(),
            $generation,
            hash('sha256', $text),
            ['journal'],
        );
    }

    private function target(): string
    {
        return sprintf('%s/targets/%s/claude-code', $this->root, TestIds::of(1));
    }
}
