<?php

declare(strict_types=1);

namespace Tests\Commands\Projects;

use App\Commands\Projects\RecordBindingRuntimeStop\RecordBindingRuntimeStopCommand;
use Carbon\CarbonImmutable;
use Illuminate\Support\Str;
use Illuminate\Testing\TestResponse;
use Inertia\Testing\AssertableInertia;
use Tests\Support\CommitsHookRows;
use Tests\Support\Connections\ConnectsProjects;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\TestCase;

/**
 * An ended lease reads stop unconfirmed until its stop receipt arrives, which counts once.
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

    public function test_an_ended_lease_reads_stop_unconfirmed_until_its_stop_receipt_which_counts_once(): void
    {
        $this->issueLine('the-ticket');
        $binding = (string) $this->redeemLine('the-ticket', 'nonce-aaaaaaaaaaaaaaaa')->assertCreated()->json('bindingId');
        $this->notifyClaudeCode('nonce-aaaaaaaaaaaaaaaa', $binding);
        $runtime = '01JAAAAAAAAAAAAAAAAAAAAAAA';
        $this->bindings()->findOrFail($binding)->holdLease($runtime, CarbonImmutable::now()->subMinute());

        $this->actingAs($this->owner)->get('/connections')->assertOk()->assertInertia(fn (
            AssertableInertia $page,
        ) => $page
            ->where(
                'page.data.bindings.rows.0.stateText',
                fn (string $text) => str_contains($text, 'Session stop unconfirmed'),
            ));

        $this->sendStopReceipt($binding, $runtime)->assertNoContent();
        $this->sendStopReceipt($binding, $runtime)->assertNoContent();

        $this->actingAs($this->owner)->get('/connections')->assertOk()->assertInertia(fn (
            AssertableInertia $page,
        ) => $page->where('page.data.bindings.rows.0.stateText', 'Ready.'));
    }

    private function sendStopReceipt(string $binding, string $runtime): TestResponse
    {
        return $this->signedRelayCall(
            $this->relayCredential('nonce-aaaaaaaaaaaaaaaa'),
            "/host/bindings/{$binding}/runtimes/{$runtime}/stopped",
            [],
            (string) Str::uuid(),
        );
    }
}
