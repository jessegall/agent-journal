<?php

declare(strict_types=1);

namespace Tests\Feature\Skills;

use App\Agents\Enums\SessionStatus;
use App\Agents\Events\LaunchStarted;
use App\Agents\Models\Agent;
use App\Agents\Models\AgentSession;
use App\Agents\Support\StackTarget;
use App\Hooks\Enums\ContextStartType;
use App\Hooks\Enums\ToolOutcome;
use App\Hooks\Events\ContextStarted;
use App\Hooks\Events\ToolCallFinished;
use App\Hooks\Inputs\ToolResult;
use App\Hooks\Support\ContextReminders;
use App\Skills\Enums\ReadEvidence;
use App\Skills\Listeners\AdmitLaunchSkills;
use App\Skills\Listeners\AdvanceSkillContext;
use App\Skills\Listeners\RecordProvenSkillReads;
use App\Skills\Models\SkillPublication;
use App\Skills\Models\SkillReceipt;
use App\Skills\Support\SkillPublishing;
use App\Skills\Support\SkillTargets;
use Illuminate\Support\Facades\File;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\CommitsHookRows;
use Tests\Support\InstallsBuiltInProfiles;
use Tests\TestCase;

/**
 * A proven whole read of a delivered skill leaves one receipt with the delivered digest; a listing leaves none; after
 * a compaction the skill reads as unread.
 */
final class SkillReceiptsTest extends TestCase
{
    use CommitsHookRows;
    use InstallsBuiltInProfiles;

    private const array TABLES = [
        'skill_receipts',
        'skill_context_epochs',
        'skill_publications',
        'skill_generations',
        'command_receipts',
        'agents',
        'agent_sessions',
    ];

    private string $root;

    protected function setUp(): void
    {
        parent::setUp();

        $this->root = sys_get_temp_dir().'/journal-skills-'.bin2hex(random_bytes(6));
        File::makeDirectory($this->root, recursive: true);
        $this->root = (string) realpath($this->root);
        $this->app->instance(SkillTargets::class, new SkillTargets($this->root));
        $this->app->make(SkillPublishing::class)->refresh();
    }

    protected function tearDown(): void
    {
        File::deleteDirectory($this->root);

        parent::tearDown();
    }

    public function test_a_skill_tool_read_records_one_receipt_with_the_delivered_digest(): void
    {
        $session = $this->launchedMainAgent();
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
        $session = $this->launchedMainAgent();

        $this->finished($session, 'Bash', ['command' => "ls {$this->root}/targets"]);

        $this->assertSame(0, SkillReceipt::query()->where('session_id', $session->id)->count());
    }

    public function test_after_a_compaction_the_skill_reads_as_unread(): void
    {
        $session = $this->launchedMainAgent();
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

    private function launchedMainAgent(): AgentSession
    {
        $agent = Agent::named('Main', 'main-agent');
        $session = new AgentSession(TestSelections::sessionColumns());
        $session->agent_id = $agent->id;
        $session->status = SessionStatus::Active;
        $session->save();
        $this->app->make(AdmitLaunchSkills::class)->handle(
            new LaunchStarted($agent->id, $session->id),
        );

        return $session;
    }

    private function deliveredDigest(AgentSession $session, string $key): string
    {
        $publication = SkillPublication::latestOfSession($session->id);
        $this->assertNotNull($publication);
        $entry = $publication->generation()->entry($key);
        $this->assertNotNull($entry);

        return $entry['digest'];
    }

    /**
     * @param  array<string, mixed>  $arguments
     */
    private function finished(AgentSession $session, string $tool, array $arguments): void
    {
        $this->app->make(RecordProvenSkillReads::class)->handle(new ToolCallFinished(
            new StackTarget($session->agent_id, $session->id),
            new ToolResult($tool, ToolOutcome::Succeeded, $arguments),
        ));
    }
}
