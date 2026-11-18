<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Feature;

use App\Skills\Contracts\SkillReader;
use App\Skills\Values\SkillKey;
use Domain\Plans\Tests\TestCase;
use Illuminate\Support\Facades\Artisan;
use Tests\Support\RefreshHookDatabase;

/**
 * Plans supplies the journal-plans skill through ProvidesSkills: a written section, then two heading subtrees of
 * resources/skills/plans.md, in that order.
 */
final class PlanSkillTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_journal_plans_is_owned_by_plans_and_shows_its_sections_in_order(): void
    {
        Artisan::call('skill:list', ['--json' => true]);
        $listed = array_column(json_decode(Artisan::output(), true, flags: JSON_THROW_ON_ERROR), 'owner', 'key');

        $this->assertSame('Plans', $listed['journal-plans']);

        Artisan::call('skill:show', ['key' => 'journal-plans']);
        $shown = Artisan::output();

        $this->assertSame($this->app->make(SkillReader::class)->find(SkillKey::from('journal-plans'))->rendered->markdown, $shown);
        $this->assertStringContainsString("# Plans\n\n## Purpose\n\nA plan orders the work", $shown);
        $this->assertStringContainsString("## States\n\nA plan has a type (build, fix, research or cleanup)", $shown);
        $this->assertStringContainsString("## Holding plan work\n\n- `plan:assigned` lists the plans you hold.", $shown);
        $this->assertLessThan(strpos($shown, '## Holding plan work'), strpos($shown, '## States'));
    }
}
