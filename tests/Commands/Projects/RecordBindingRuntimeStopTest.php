<?php

declare(strict_types=1);

namespace Tests\Commands\Projects;

use App\Commands\Projects\RecordBindingRuntimeStop\RecordBindingRuntimeStopCommand;
use App\Models\Projects\ProjectBinding;
use Carbon\CarbonImmutable;
use Tests\Support\CommitsHookRows;
use Tests\Support\Connections\ConnectsProjects;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\TestCase;

/**
 * An ended lease reads stop unconfirmed until its stop receipt arrives; a repeated receipt changes nothing.
 */
#[TestsCommand(RecordBindingRuntimeStopCommand::class)]
final class RecordBindingRuntimeStopTest extends TestCase
{
    use CommitsHookRows;
    use ConnectsProjects;

    private const array TABLES = [
        'command_receipts', 'connection_audits', 'project_invitations', 'install_attempts', 'project_bindings',
        'project_environments', 'projects', 'agent_runtimes', 'agents', 'hosts', 'settings_records', 'users',
    ];

    public function test_an_ended_lease_reads_stop_unconfirmed_until_its_stop_receipt_and_a_repeat_changes_nothing(): void
    {
        $this->issueLine('the-ticket');
        $binding = (string) $this->redeemLine('the-ticket', 'nonce-aaaaaaaaaaaaaaaa')->assertCreated()->json('bindingId');
        $this->notifyClaudeCode('nonce-aaaaaaaaaaaaaaaa', $binding);
        $runtime = '01JAAAAAAAAAAAAAAAAAAAAAAA';
        ProjectBinding::query()->findOrFail($binding)->holdLease($runtime, CarbonImmutable::now()->subMinute());

        $this->assertTrue($this->bindingOf($binding)->isStopUnconfirmedAt(CarbonImmutable::now()));

        $this->stop($binding, $runtime);
        $this->stop($binding, $runtime);

        $this->assertFalse($this->bindingOf($binding)->isStopUnconfirmedAt(CarbonImmutable::now()));
    }

    /**
     * The relay's stop receipt for the runtime, as the binding's host reports it.
     */
    private function stop(string $binding, string $runtime): void
    {
        $this->journal->asSystem(
            new RecordBindingRuntimeStopCommand($this->bindingOf($binding)->host_id, $binding, $runtime),
        );
    }

    private function bindingOf(string $binding): ProjectBinding
    {
        return ProjectBinding::query()->findOrFail($binding);
    }
}
