<?php

declare(strict_types=1);

namespace Tests\Machinery\Processes;

use App\CommandRules\Values\PermitLimits;
use App\Models\Agents\Agent;
use App\Models\CommandRules\EvidencePermit;
use App\Models\Runs\PartRun;
use App\Models\Runs\ProcessRun;
use App\Processes\Enums\RunMode;
use App\Processes\EvidenceRuns;
use App\Support\ActorReference;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\Entries\Attributes\TestsMachinery;
use Tests\Support\Processes\ProcessOutputDisk;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * A project owner's one-use permit runs its exact command line once as an evidence-only run.
 */
#[TestsMachinery(EvidenceRuns::class)]
final class EvidencePermitTest extends TestCase
{
    use RefreshHookDatabase;

    private TestStart $start;

    private string $folder;

    protected function setUp(): void
    {
        parent::setUp();

        ProcessOutputDisk::fake();
        config(['journal.processes.runner' => true]);
        $this->start = $this->journal->signedStart('Main agent', 'main-agent');
        $this->journal->relayAgentCommands($this->start);
        $this->folder = sys_get_temp_dir().'/evidence-'.bin2hex(random_bytes(4));
        mkdir($this->folder.'/project', recursive: true);
        touch($this->folder.'/project/notes.txt');
    }

    #[TimeLimit(10, 'It runs process:run twice through the signed channel.')]
    public function test_a_permit_runs_once_as_evidence_and_its_request_id_returns_the_same_run(): void
    {
        $permit = $this->permit();

        $options = ['--permit' => $permit->id, '--request-key' => 'first'];
        $this->artisan('process:run', $options)->expectsOutputToContain('notes.txt')->assertExitCode(0);
        $this->artisan('process:run', $options)->expectsOutputToContain('already started')->assertExitCode(0);

        $run = ProcessRun::query()->withoutGlobalScopes()->findOrFail($permit->refresh()->process_run_id);
        $this->assertSame(RunMode::Evidence, $run->mode);
        $this->assertFalse($run->mayAnswer());
        $this->assertSame(1, PartRun::query()->where('process_run_id', $run->id)->count());
    }

    private function permit(): EvidencePermit
    {
        $limits = new PermitLimits(1_000_000, 60, 60);
        // A permit is issued on the agent's own call, so it belongs to the agent's project.
        $this->journal->actAs('Main agent');

        return $this->app->make(EvidenceRuns::class)->issue('ls project', $this->folder, $this->agent(), $limits);
    }

    private function agent(): ActorReference
    {
        return ActorReference::ofClass(Agent::class, $this->start->agent->id);
    }
}
