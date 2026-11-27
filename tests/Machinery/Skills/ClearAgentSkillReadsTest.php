<?php

declare(strict_types=1);

namespace Tests\Machinery\Skills;

use App\Events\Hooks\ContextStarted;
use App\Hooks\Enums\ContextStartType;
use App\Hooks\ReminderContribution;
use App\Listeners\ClearAgentSkillReads;
use App\Models\Agents\AgentSession;
use App\Models\Skills\SkillReadEntry;
use App\Skills\Enums\ReadEvidence;
use App\Values\StackTarget;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\Support\Entries\Attributes\TestsMachinery;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * A session start leaves its agent with no skill read on record, a clear or a compaction keeps them, and another
 * agent's reads stay.
 */
#[TestsMachinery(ClearAgentSkillReads::class)]
final class ClearAgentSkillReadsTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_a_start_leaves_the_agent_no_reads_and_another_agent_its_own(): void
    {
        $this->journal->owner()->agent('Writer')->agent('Reader');
        $writer = $this->journal->sessionOf('Writer');
        $reader = $this->journal->sessionOf('Reader');
        SkillReadEntry::create($writer, 'journal', ReadEvidence::SkillShow);
        SkillReadEntry::create($reader, 'journal', ReadEvidence::SkillShow);

        $this->boundary($writer, ContextStartType::Start);

        $this->assertSame([], SkillReadEntry::findLatestOfSession($writer->id, 10));
        $this->assertCount(1, SkillReadEntry::findLatestOfSession($reader->id, 10));
    }

    /**
     * @return iterable<string, array{ContextStartType}>
     */
    public static function boundariesThatKeepReads(): iterable
    {
        yield 'a clear' => [ContextStartType::Clear];

        yield 'a compaction' => [ContextStartType::Compact];

        yield 'a resume' => [ContextStartType::Resume];
    }

    #[DataProvider('boundariesThatKeepReads')]
    public function test_the_other_boundaries_keep_the_reads(ContextStartType $type): void
    {
        $this->journal->owner()->agent('Writer');
        $session = $this->journal->sessionOf('Writer');
        SkillReadEntry::create($session, 'journal', ReadEvidence::SkillShow);

        $this->boundary($session, $type);

        $this->assertCount(1, SkillReadEntry::findLatestOfSession($session->id, 10));
    }

    private function boundary(AgentSession $session, ContextStartType $type): void
    {
        $this->app->make(ClearAgentSkillReads::class)->handle(new ContextStarted(
            new StackTarget($session->agent_id, $session->id),
            'hook-'.bin2hex(random_bytes(4)),
            $type,
            $this->app->make(ReminderContribution::class),
        ));
    }
}
