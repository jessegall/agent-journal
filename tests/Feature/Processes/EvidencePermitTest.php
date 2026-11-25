<?php

declare(strict_types=1);

namespace Tests\Feature\Processes;

use App\Enums\Runs\RunMode;
use App\Exceptions\EvidencePermitRefused;
use App\Models\Agents\Agent;
use App\Models\CommandRules\EvidencePermit;
use App\Models\Runs\PartRun;
use App\Models\Runs\ProcessRun;
use App\Support\ActorIdentity;
use App\Support\EvidenceRuns;
use App\Values\PermitLimits;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\Processes\ProcessOutputDisk;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\SendsSignedPayloads;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * A project owner's one-use permit runs its exact command line once as an evidence-only run.
 */
final class EvidencePermitTest extends TestCase
{
    use RefreshHookDatabase;
    use SendsSignedPayloads;

    private TestStart $start;

    private string $folder;

    protected function setUp(): void
    {
        parent::setUp();

        ProcessOutputDisk::fake();
        config(['processes.runner' => true]);
        $this->start = TestStart::start();
        $this->runCommandsAs($this->start);
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

    public function test_a_used_expired_or_foreign_permit_is_refused(): void
    {
        $evidence = $this->app->make(EvidenceRuns::class);
        $used = $this->permit();
        $evidence->start($used, $this->agent(), 'first');

        $this->assertRefused(fn () => $evidence->start($used, $this->agent(), 'second'));
        $expired = $this->permit();
        $expired->expire();
        $this->assertRefused(fn () => $evidence->start($expired, $this->agent(), 'first'));
        $stranger = ActorIdentity::ofClass(Agent::class, 'another-agent');
        $this->assertRefused(fn () => $evidence->start($this->permit(), $stranger, 'first'));
    }

    private function permit(): EvidencePermit
    {
        $limits = new PermitLimits(1_000_000, 60, 60);

        return $this->app->make(EvidenceRuns::class)->issue('ls project', $this->folder, $this->agent(), $limits);
    }

    private function agent(): ActorIdentity
    {
        return ActorIdentity::ofClass(Agent::class, $this->start->agent->id);
    }

    private function assertRefused(callable $attempt): void
    {
        try {
            $attempt();
            $this->fail('The permit was not refused.');
        } catch (EvidencePermitRefused) {
            $this->addToAssertionCount(1);
        }
    }
}
