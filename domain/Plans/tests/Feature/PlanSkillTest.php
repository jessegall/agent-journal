<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Feature;

use App\Skills\Contracts\SkillResolver;
use App\Skills\Values\SkillKey;
use Domain\Plans\Tests\TestCase;
use Illuminate\Support\Facades\Artisan;
use Tests\Support\RefreshHookDatabase;

/**
 * Plans supplies the journal-plans skill through SkillProvider: a written section, then two heading subtrees of
 * resources/skills/plans.md, in that order.
 */
final class PlanSkillTest extends TestCase
{
    use RefreshHookDatabase;

    private const string PURPOSE_TEXT = <<<'TEXT'
        # Plans

        ## Purpose

        A plan orders the work
        TEXT;

    private const string STATES_TEXT = <<<'TEXT'
        ## States

        A plan has a type (build, fix, research or cleanup)
        TEXT;

    private const string HOLDING_TEXT = <<<'TEXT'
        ## Holding plan work

        - `plan:assigned` lists the plans you hold.
        TEXT;

    public function test_journal_plans_is_owned_by_plans_and_shows_its_sections_in_order(): void
    {
        Artisan::call('skill:list', ['--json' => true]);
        $listed = array_column(json_decode(Artisan::output(), true, flags: JSON_THROW_ON_ERROR), 'owner', 'key');

        $this->assertSame('Plans', $listed['journal-plans']);

        Artisan::call('skill:show', ['key' => 'journal-plans']);
        $shown = Artisan::output();

        $this->assertSame(
            $this->app->make(SkillResolver::class)->find(SkillKey::from('journal-plans'))->rendered->markdown,
            $shown,
        );

        $this->assertStringContainsString(self::PURPOSE_TEXT, $shown);

        $this->assertStringContainsString(self::STATES_TEXT, $shown);

        $this->assertStringContainsString(
            self::HOLDING_TEXT,
            $shown,
        );

        $this->assertLessThan(strpos($shown, '## Holding plan work'), strpos($shown, '## States'));
    }
}
