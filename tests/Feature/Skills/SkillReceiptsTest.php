<?php

declare(strict_types=1);

namespace Tests\Feature\Skills;

use App\Agents\Models\AgentSession;
use App\Agents\Values\StackTarget;
use App\Hooks\Enums\ContextStartType;
use App\Hooks\Events\ContextStarted;
use App\Hooks\Support\ContextReminders;
use App\Skills\Enums\ReadEvidence;
use App\Skills\Listeners\AdvanceSkillContext;
use App\Skills\Models\SkillPublication;
use App\Skills\Models\SkillReceipt;
use Tests\Support\CommitsHookRows;
use Tests\Support\InstallsBuiltInProfiles;
use Tests\Support\Skills\AdmitsMainAgentSkills;
use Tests\Support\Skills\FinishesToolCalls;
use Tests\Support\Skills\PublishesSkills;
use Tests\TestCase;

/**
 * A proven whole read of a delivered skill leaves one receipt with the delivered digest; a listing leaves none; after
 * a compaction the skill reads as unread.
 */
final class SkillReceiptsTest extends TestCase
{
    use AdmitsMainAgentSkills;
    use CommitsHookRows;
    use FinishesToolCalls;
    use InstallsBuiltInProfiles;
    use PublishesSkills;

    private const array TABLES = [
        'skill_receipts',
        'skill_context_epochs',
        'skill_publications',
        'skill_generations',
        'command_receipts',
        'profile_revisions',
        'profiles',
        'agents',
        'agent_sessions',
    ];

    public function test_a_skill_tool_read_records_one_receipt_with_the_delivered_digest(): void
    {
        $session = $this->startedMainAgent();
        $digest = $this->deliveredDigest($session, 'journal-plans');

        $this->finished($session, 'Skill', ['skill' => 'journal-session-skills:journal-plans']);
        $this->finished($session, 'Skill', ['skill' => 'journal-session-skills:journal-plans']);

        $receipts = SkillReceipt::query()->where('session_id', $session->id)->get();
        $this->assertCount(1, $receipts);
        $this->assertSame('journal-plans', $receipts[0]->skill_key);
        $this->assertSame($digest, $receipts[0]->content_digest);
        $this->assertSame(ReadEvidence::ClaudeSkillTool, $receipts[0]->evidence);
        $this->assertTrue(SkillReceipt::hasRead($session->id, 'journal-plans', $digest));
    }

    public function test_a_directory_listing_records_none(): void
    {
        $session = $this->startedMainAgent();

        $this->finished($session, 'Bash', ['command' => "ls {$this->root}/targets"]);

        $this->assertSame(0, SkillReceipt::query()->where('session_id', $session->id)->count());
    }

    public function test_after_a_compaction_the_skill_reads_as_unread(): void
    {
        $session = $this->startedMainAgent();
        $digest = $this->deliveredDigest($session, 'journal-plans');
        $this->finished($session, 'mcp__journal__skills_show', ['key' => 'journal-plans']);
        $this->assertTrue(SkillReceipt::hasRead($session->id, 'journal-plans', $digest));

        $this->app->make(AdvanceSkillContext::class)->handle(new ContextStarted(
            new StackTarget($session->agent_id, $session->id),
            'hook-compact',
            ContextStartType::Compact,
            $this->app->make(ContextReminders::class),
        ));

        $this->assertFalse(SkillReceipt::hasRead($session->id, 'journal-plans', $digest));
    }

    private function deliveredDigest(AgentSession $session, string $key): string
    {
        $publication = SkillPublication::latestOfSession($session->id);
        $this->assertNotNull($publication);
        $entry = $publication->generation()->entry($key);
        $this->assertNotNull($entry);

        return $entry['digest'];
    }
}
