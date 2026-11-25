<?php

declare(strict_types=1);

namespace Tests\Commands\CommandRules;

use App\Commands\CommandRules\IssueEvidencePermit\IssueEvidencePermitCommand;
use App\Exceptions\EvidencePermitRefused;
use App\Models\Agents\Agent;
use App\Models\CommandRules\EvidencePermit;
use App\Support\ActorIdentity;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\Processes\ProcessOutputDisk;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * The owner issues an evidence permit for a known line, made out to its runner; an unknown line gets no permit.
 */
final class IssueEvidencePermitTest extends TestCase
{
    use RefreshHookDatabase;

    private TestStart $start;

    private string $folder;

    protected function setUp(): void
    {
        parent::setUp();

        ProcessOutputDisk::fake();
        config(['processes.runner' => true]);
        $this->start = $this->journal->signedStart('Test agent');
        $this->journal->relayAgentCommands($this->start);
        $this->folder = sys_get_temp_dir().'/evidence-'.bin2hex(random_bytes(4));
        mkdir($this->folder.'/project', recursive: true);
        touch($this->folder.'/project/notes.txt');
    }

    public function test_a_known_line_gets_a_permit_for_its_runner(): void
    {
        $agent = $this->agent();

        $permitId = $this->issue('ls project');

        $permit = EvidencePermit::query()->findOrFail($permitId);
        $this->assertSame(
            ['ls project', $agent->type, $agent->id],
            [$permit->source_line, $permit->runner_type, $permit->runner_id],
        );
    }

    public function test_an_unknown_line_gets_no_permit(): void
    {
        $this->assertThrows(fn () => $this->issue('python3 tool.py'), EvidencePermitRefused::class);
        $this->assertSame(0, EvidencePermit::query()->count());
    }

    private function issue(string $line): string
    {
        $agent = $this->agent();
        $this->journal->owner();

        return $this->journal->run(new IssueEvidencePermitCommand($line, $this->folder, $agent->type, $agent->id));
    }

    private function agent(): ActorIdentity
    {
        return ActorIdentity::ofClass(Agent::class, $this->start->agent->id);
    }
}
