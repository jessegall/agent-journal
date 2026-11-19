<?php

declare(strict_types=1);

namespace Tests\Unit\Skills;

use App\CoreApi;
use App\Programs\Values\ProgramKey;
use App\Programs\Values\ProviderKey;
use App\Skills\Conditions\Conditions;
use App\Skills\Contracts\ProgramSkills;
use App\Skills\Contracts\ProvidesSkillConditions;
use App\Skills\Contracts\ProvidesSkills;
use App\Skills\Contracts\Skill;
use App\Skills\Contracts\SkillCondition;
use App\Skills\Contracts\SkillPublisher;
use App\Skills\Contracts\SkillRenderer;
use App\Skills\Contracts\SkillResolver;
use App\Skills\Contracts\SkillSource;
use App\Skills\Enums\ConditionOutcome;
use App\Skills\Exceptions\SkillKeyInvalid;
use App\Skills\Values\LaunchProfile;
use App\Skills\Values\MarkdownPart;
use App\Skills\Values\SkillContext;
use App\Skills\Values\SkillKey;
use App\Skills\Values\SkillSection;
use App\Skills\Values\SkillSections;
use Tests\Support\TestActors;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * The public seams of skills: domains and modules declare skills and condition types through exported contracts,
 * while the renderer, sources, publisher and program adapters stay Core's own.
 */
final class SkillContractsTest extends TestCase
{
    public function test_core_exports_what_a_domain_needs_to_declare_skills_and_keeps_the_ports_private(): void
    {
        $exports = CoreApi::exports();

        foreach ([ProvidesSkills::class, Skill::class, SkillCondition::class, ProvidesSkillConditions::class, SkillResolver::class] as $contract) {
            $this->assertContains($contract, $exports->contracts);
        }

        foreach ([SkillKey::class, SkillSection::class, SkillSections::class, MarkdownPart::class, SkillContext::class, Conditions::class] as $value) {
            $this->assertContains($value, $exports->values);
        }

        foreach ([SkillRenderer::class, SkillSource::class, SkillPublisher::class, ProgramSkills::class] as $port) {
            $this->assertFalse($exports->has($port), "{$port} is exported.");
        }
    }

    public function test_a_skill_key_shares_the_stable_key_grammar_and_knows_its_reserved_prefixes(): void
    {
        $this->assertTrue(SkillKey::from('journal-plans')->isFirstParty());
        $this->assertTrue(SkillKey::from('user-review-notes')->isUserAuthored());
        $this->assertTrue(SkillKey::from('notes-daily')->hasPrefix('notes'));
        $this->assertFalse(SkillKey::from('notesy-daily')->hasPrefix('notes'));

        $this->expectException(SkillKeyInvalid::class);

        SkillKey::from('Journal_Plans');
    }

    public function test_sections_and_parts_keep_what_they_were_built_with_and_everyone_matches(): void
    {
        $part = MarkdownPart::heading('plans.md', ['Failure', 'Retry']);
        $section = SkillSection::markdown('phases', 'Working a phase', $part);
        $context = new SkillContext(TestActors::agentIdentity(3), TestIds::of(4), 'main', LaunchProfile::profileFree(), ProgramKey::from('codex'), ProviderKey::from('openai'));

        $this->assertSame('plans.md > Failure > Retry', $part->selector());
        $this->assertTrue(MarkdownPart::body('plans.md')->isWholeBody());
        $this->assertSame($part, $section->content);
        $this->assertSame('A plan orders the work.', SkillSection::text('purpose', 'Plans', 'A plan orders the work.')->content);
        $this->assertSame(ConditionOutcome::Match, Conditions::everyone()->evaluate($context)->outcome);
        $this->assertTrue($context->profile->isProfileFree());
    }
}
