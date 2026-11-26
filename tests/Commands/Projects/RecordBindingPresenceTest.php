<?php

declare(strict_types=1);

namespace Tests\Commands\Projects;

use App\Commands\Inboxes\InstallInboxes\InstallInboxesCommand;
use App\Commands\Projects\RecordBindingPresence\RecordBindingPresenceCommand;
use App\Enums\Accounts\CommandEntry;
use App\Enums\Connections\BindingReadiness;
use App\Models\Agents\AgentRuntime;
use App\Models\Projects\ProjectBinding;
use App\Support\JournalCommands;
use Carbon\CarbonImmutable;
use Illuminate\Support\Str;
use Illuminate\Testing\TestResponse;
use Tests\Support\CommitsHookRows;
use Tests\Support\Connections\ConnectsProjects;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * A relay reports its binding's presence: a first provisioned report turns the binding ready with no runtime, an older
 * setup or a replayed sequence changes nothing, a new boot takes over a live one only when it asks, another host is
 * refused, and the binding reads offline once its presence expires.
 */
#[TestsCommand(RecordBindingPresenceCommand::class)]
final class RecordBindingPresenceTest extends TestCase
{
    use CommitsHookRows;
    use ConnectsProjects;
    use WithActiveAccount;

    private const array TABLES = [
        'connection_audits',
        'project_invitations',
        'install_attempts',
        'project_bindings',
        'project_environments',
        'projects',
        'agent_runtimes',
        'agents',
        'hosts',
        'settings_records',
        'users',
        'binding_runtimes',
        'agent_sessions',
        'accounts',
        'active_accounts',
        'inboxes',
        'inbox_members',
    ];

    private const string NONCE = 'nonce-aaaaaaaaaaaaaaaa';

    private const string EARLIER_SESSIONS = 'reported what became of its earlier sessions';

    public function test_a_first_provisioned_report_turns_the_binding_ready_with_no_runtime(): void
    {
        $binding = $this->connected(self::NONCE);

        $reply = $this->notify(self::NONCE, $binding, 'boot-1', 1)->assertOk();

        $fresh = ProjectBinding::query()->findOrFail($binding);
        $this->assertSame(BindingReadiness::Ready, $fresh->readinessAt(CarbonImmutable::now()));
        $this->assertSame(1, $reply->json('generation'));
        $this->assertSame(0, AgentRuntime::query()->count());
    }

    public function test_a_report_of_an_older_setup_after_a_new_one_changes_nothing(): void
    {
        $binding = $this->connected(self::NONCE);
        $this->notify(self::NONCE, $binding, 'boot-1', 1, setupGeneration: 2)->assertOk();
        $before = ProjectBinding::query()->findOrFail($binding);

        $this->travel(10)->seconds();
        $stale = $this->notify(self::NONCE, $binding, 'boot-1', 2, setupGeneration: 1)->assertOk();

        $after = ProjectBinding::query()->findOrFail($binding);
        $this->assertSame(2, $stale->json('setupGeneration'));
        $this->assertSame($binding, $stale->json('bindingId'));
        $this->assertSame(1, $after->report_sequence);
        $this->assertEquals($before->presence_expires_at, $after->presence_expires_at);
    }

    public function test_a_replayed_older_sequence_changes_nothing(): void
    {
        $binding = $this->connected(self::NONCE);
        $this->notify(self::NONCE, $binding, 'boot-1', 5)->assertOk();
        $before = ProjectBinding::query()->findOrFail($binding);

        $this->travel(10)->seconds();
        $this->notify(self::NONCE, $binding, 'boot-1', 3)->assertOk();

        $after = ProjectBinding::query()->findOrFail($binding);
        $this->assertSame(5, $after->report_sequence);
        $this->assertEquals($before->presence_expires_at, $after->presence_expires_at);
    }

    public function test_a_new_boot_takes_over_a_live_one_only_when_it_asks(): void
    {
        $binding = $this->connected(self::NONCE);
        $this->notify(self::NONCE, $binding, 'boot-1', 1)->assertOk();

        $this->notify(self::NONCE, $binding, 'boot-2', 1)->assertConflict();
        $taken = $this->notify(self::NONCE, $binding, 'boot-2', 1, isTakeover: true)->assertOk();

        $this->assertSame(2, $taken->json('generation'));
    }

    public function test_a_report_from_another_host_is_refused(): void
    {
        $binding = $this->connected(self::NONCE);
        $this->connected('nonce-bbbbbbbbbbbbbbbb');

        $this->notify('nonce-bbbbbbbbbbbbbbbb', $binding, 'boot-1', 1)->assertForbidden();

        $this->assertSame(BindingReadiness::Pending, ProjectBinding::query()->findOrFail($binding)->readiness);
    }

    public function test_the_binding_reads_offline_once_its_presence_expires_with_no_report(): void
    {
        $binding = $this->connected(self::NONCE);
        $this->notify(self::NONCE, $binding, 'boot-1', 1)->assertOk();

        $this->travel(ProjectBinding::PRESENCE_SECONDS + 1)->seconds();

        $offline = ProjectBinding::query()->findOrFail($binding)->readinessAt(CarbonImmutable::now());
        $this->assertSame(BindingReadiness::Offline, $offline);
    }

    public function test_a_new_boot_of_the_relay_starts_nothing_until_it_reported_its_earlier_sessions(): void
    {
        $this->chooseActiveAccounts();
        $this->app->make(JournalCommands::class)
            ->runAsJournal(CommandEntry::HostControl, 'inbox install', new InstallInboxesCommand());

        $binding = $this->connectedBinding('the-ticket', self::NONCE);
        $this->signedRelayCall(
            $this->relayCredential(self::NONCE),
            "/host/bindings/{$binding->id}/presence",
            [
                'bootId' => 'boot-after-sleep',
                'sequence' => 1,
                'release' => '1.0.0',
                'provisioning' => 'succeeded',
                'isTakeover' => true,
                'setupGeneration' => 1,
            ],
            (string) Str::uuid(),
        )->assertOk();

        $refused = $this->start($binding, [])->assertForbidden();

        $this->assertStringContainsString(
            self::EARLIER_SESSIONS,
            (string) $refused->json('message'),
        );
        $this->assertSame(0, AgentRuntime::query()->count());
    }

    private function connected(string $nonce): string
    {
        $ticket = 'ticket-'.$nonce;
        $this->issueLine($ticket);

        return (string) $this->redeemLine($ticket, $nonce)->assertCreated()->json('bindingId');
    }

    private function notify(
        string $nonce,
        string $binding,
        string $bootId,
        int $sequence,
        bool $isTakeover = false,
        int $setupGeneration = 1,
    ): TestResponse {
        return $this->signedRelayCall(
            $this->relayCredential($nonce),
            "/host/bindings/{$binding}/presence",
            [
                'bootId' => $bootId,
                'sequence' => $sequence,
                'release' => '1.0.0',
                'provisioning' => 'succeeded',
                'isTakeover' => $isTakeover,
                'setupGeneration' => $setupGeneration,
            ],
            (string) Str::uuid(),
        );
    }

    /**
     * A redeemed binding whose relay reported it can run Claude Code isolated.
     */
    private function connectedBinding(string $ticket, string $nonce): ProjectBinding
    {
        $binding = $this->redeemed($ticket, $nonce);
        $this->notifyClaudeCode($nonce, $binding->id);

        return $binding;
    }

    private function redeemed(string $ticket, string $nonce): ProjectBinding
    {
        $this->issueLine($ticket);

        return ProjectBinding::query()->findOrFail(
            $this->redeemLine($ticket, $nonce)->assertCreated()->json('bindingId'),
        );
    }

    /**
     * @param  array<string, string>  $changes
     */
    private function start(ProjectBinding $binding, array $changes): TestResponse
    {
        return $this->signedStart(self::NONCE, $binding, $changes);
    }

    /**
     * @param  array<string, string>  $changes
     */
    private function signedStart(string $nonce, ProjectBinding $binding, array $changes): TestResponse
    {
        return $this->signedRelayCall(
            $this->relayCredential($nonce),
            "/host/bindings/{$binding->id}/runtimes",
            [
                'rootId' => $binding->root_id,
                'folder' => $binding->canonical_root,
                'agentId' => $binding->main_agent_id,
                'driver' => 'claude-code',
                'profile' => 'main-agent',
                'model' => 'opus',
                ...$changes,
            ],
            (string) Str::uuid(),
        );
    }
}
