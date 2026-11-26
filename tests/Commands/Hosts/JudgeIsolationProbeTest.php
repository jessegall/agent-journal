<?php

declare(strict_types=1);

namespace Tests\Commands\Hosts;

use App\Agents\Drivers\Isolation\IsolationProbes;
use App\Commands\Hosts\JudgeIsolationProbe\JudgeIsolationProbeCommand;
use App\Commands\Hosts\RequestHostProtection\RequestHostProtectionCommand;
use App\Enums\Hosts\HostOrderType;
use App\Enums\Hosts\HostProcessPurpose;
use App\Enums\Hosts\HostProcessReportType;
use App\Models\Projects\Host;
use App\Values\ProtectionReport;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * An ended relay probe that ran opens the sandbox probe; a sandbox probe that ran keeps the verdict that Claude
 * Code's sandbox runs, and a failed probe keeps why it does not, each judging Claude Code's protection in the standard
 * container again; every ended probe's container is removed.
 */
#[TestsCommand(JudgeIsolationProbeCommand::class)]
final class JudgeIsolationProbeTest extends TestCase
{
    use RefreshHookDatabase;

    private const string CLAUDE_IN_CONTAINER = 'claude-code@2.1.323';

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->enrollContainedHost('Box', [base_path()]);
        $this->journal->asSystem(new RequestHostProtectionCommand($this->journal->hostCalled('Box')->hostId));
        $this->journal->callHostProcessOf('relay', 'Box', HostProcessPurpose::RelayProbe);
    }

    public function test_probes_that_run_open_the_sandbox_probe_then_keep_that_the_sandbox_runs(): void
    {
        $this->end('relay', 0, "socat version 1.8\n");
        $this->journal->callHostProcessOf('sandbox', 'Box', HostProcessPurpose::SandboxProbe);
        $sandboxArgv = $this->journal->payloadOf($this->journal->hostOrdersOf('sandbox')[0])['argv'];
        $this->end('sandbox', 0, '');

        $this->journal->assertResult(
            [IsolationProbes::SANDBOX_ARGV, true, true, 2],
            [
                $sandboxArgv,
                $this->host()->sandboxVerdictFor($this->journal->service(IsolationProbes::class)->image())->isRunnable,
                $this->claudeReport()->awaitsEvidenceOnly(),
                count($this->removals()),
            ],
        );
    }

    public function test_a_failed_relay_probe_keeps_why_claude_codes_sandbox_cannot_run(): void
    {
        $this->end('relay', 127, "socat: not found\n");

        $why = "no native mechanism: Claude Code's sandbox needs socat, which does not run in the agent image: socat: not found";
        $this->journal->assertResult(
            [$why, ["journal-process-{$this->journal->hostProcessCalled('relay')->id}"]],
            [$this->claudeReport()->items[0]->reason, array_column($this->removals(), 'container')],
        );
    }

    private function end(string $name, int $exitCode, string $printed): void
    {
        $this->journal->reportHostProcess($name, HostProcessReportType::Running)
            ->reportHostProcess($name, HostProcessReportType::Exited, $exitCode);
        $this->journal->asSystem(new JudgeIsolationProbeCommand($this->journal->hostProcessCalled($name)->id, $printed));
    }

    private function host(): Host
    {
        return Host::query()->whereKey($this->journal->hostCalled('Box')->hostId)->sole();
    }

    private function claudeReport(): ProtectionReport
    {
        return $this->host()->protection->items()[self::CLAUDE_IN_CONTAINER]->report();
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function removals(): array
    {
        $orders = array_filter($this->journal->hostOrdersOn('Box'), fn ($order) => $order->type === HostOrderType::Remove);

        return array_values(array_map(fn ($order) => $this->journal->payloadOf($order), $orders));
    }
}
