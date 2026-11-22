<?php

declare(strict_types=1);

namespace Tests\Unit\Skills;

use App\Contracts\DriverSkills;
use App\Contracts\Skill;
use App\Contracts\SkillCondition;
use App\Contracts\SkillConditionProvider;
use App\Contracts\SkillProvider;
use App\Contracts\SkillPublisher;
use App\Contracts\SkillResolver;
use App\CoreApi;
use App\Enums\ConditionOutcome;
use App\Exceptions\SkillKeyInvalid;
use App\Support\CanonicalRenderer;
use App\Support\Conditions\Conditions;
use App\Support\StoredSkillSource;
use App\Values\DriverKey;
use App\Values\MarkdownPart;
use App\Values\ProviderKey;
use App\Values\SkillContext;
use App\Values\SkillKey;
use App\Values\SkillSection;
use App\Values\SkillSections;
use App\Values\StartProfile;
use Tests\Support\TestActors;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * The public seams of skills: domains and modules declare skills and condition types through exported contracts,
 * while the renderer, sources, publisher and driver adapters stay Core's own.
 */
final class SkillContractsTest extends TestCase
{
    private const string PLANS_SELECTOR = 'plans.md > Failure > Retry';

    private const string PLAN_PURPOSE = 'A plan orders the work.';

    public function test_core_exports_what_a_domain_needs_to_declare_skills_and_keeps_the_ports_private(): void
    {
        $exports = CoreApi::exports();

        foreach ([
            SkillProvider::class,
            Skill::class,
            SkillCondition::class,
            SkillConditionProvider::class,
            SkillResolver::class,
        ] as $contract) {
            $this->assertContains($contract, $exports->contracts);
        }

        foreach ([
            SkillKey::class,
            SkillSection::class,
            SkillSections::class,
            MarkdownPart::class,
            SkillContext::class,
            Conditions::class,
        ] as $value) {
            $this->assertContains($value, $exports->valueClasses);
        }

        foreach ([
            CanonicalRenderer::class,
            StoredSkillSource::class,
            SkillPublisher::class,
            DriverSkills::class,
        ] as $port) {
            $this->assertFalse($exports->has($port), $port);
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
        $context = new SkillContext(
            TestActors::agentIdentity(3),
            TestIds::of(4),
            'main',
            StartProfile::profileFree(),
            DriverKey::from('codex'),
            ProviderKey::from('openai'),
        );

        $this->assertSame(self::PLANS_SELECTOR, $part->selector());
        $this->assertTrue(MarkdownPart::body('plans.md')->isWholeBody());
        $this->assertSame($part, $section->content);
        $this->assertSame(self::PLAN_PURPOSE, SkillSection::text('purpose', 'Plans', self::PLAN_PURPOSE)->content);
        $this->assertSame(ConditionOutcome::Match, Conditions::everyone()->evaluate($context)->outcome);
        $this->assertTrue($context->profile->isProfileFree());
    }
}
