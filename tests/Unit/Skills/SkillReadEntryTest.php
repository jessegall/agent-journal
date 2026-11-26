<?php

declare(strict_types=1);

namespace Tests\Unit\Skills;

use App\Events\Skills\SkillRead;
use App\Models\Skills\SkillReadEntry;
use App\Skills\Enums\ReadEvidence;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * Every proven read is a row that raises one fact; a second read is a second row; forgetting one agent's reads leaves
 * the others' and raises nothing.
 */
final class SkillReadEntryTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_a_read_writes_a_row_with_the_agent_and_session_and_raises_one_fact(): void
    {
        $this->journal->owner()->agent('Writer');
        $session = $this->journal->sessionOf('Writer');

        $entry = SkillReadEntry::record($session, 'journal', ReadEvidence::SkillShow);

        $stored = SkillReadEntry::query()->whereKey($entry->id)->sole();
        $this->assertSame($session->agent_id, $stored->agent_id);
        $this->assertSame($session->id, $stored->session_id);
        $this->assertSame('journal', $stored->skill_key);
        $this->assertSame(ReadEvidence::SkillShow, $stored->evidence);

        $raised = $entry->takeRaisedEvents();
        $this->assertCount(1, $raised);
        $this->assertEquals(new SkillRead($session->id, 'journal', ReadEvidence::SkillShow), $raised[0]);
    }

    public function test_a_second_read_is_a_second_row_and_the_newest_comes_first(): void
    {
        $this->journal->owner()->agent('Writer');
        $session = $this->journal->sessionOf('Writer');

        SkillReadEntry::record($session, 'journal', ReadEvidence::FullFileRead);
        $second = SkillReadEntry::record($session, 'journal', ReadEvidence::ClaudeSkillTool);

        $entries = SkillReadEntry::findLatestOfSession($session->id, 10);
        $this->assertCount(2, $entries);
        $this->assertSame($second->id, $entries[0]->id);
    }

    public function test_forgetting_an_agent_deletes_only_its_rows_and_raises_nothing(): void
    {
        $this->journal->owner()->agent('Writer')->agent('Reader');
        $writer = $this->journal->sessionOf('Writer');
        $reader = $this->journal->sessionOf('Reader');
        SkillReadEntry::record($writer, 'journal', ReadEvidence::SkillShow);
        SkillReadEntry::record($writer, 'journal-plans', ReadEvidence::SkillShow);
        SkillReadEntry::record($reader, 'journal', ReadEvidence::SkillShow);

        SkillReadEntry::forgetOfAgent($writer->agent_id);

        $this->assertSame([], SkillReadEntry::findLatestOfSession($writer->id, 10));
        $this->assertCount(1, SkillReadEntry::findLatestOfSession($reader->id, 10));
    }
}
