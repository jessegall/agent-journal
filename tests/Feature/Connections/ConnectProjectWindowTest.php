<?php

declare(strict_types=1);

namespace Tests\Feature\Connections;

use App\Enums\ArrangementType;
use App\Models\Agent;
use App\Models\Environment;
use App\Models\Host;
use App\Models\Project;
use App\Models\ProjectBinding;
use App\Values\BindingFolder;
use Carbon\CarbonImmutable;
use Domain\Access\Models\User;
use Illuminate\Support\Str;
use Illuminate\Testing\TestResponse;
use Inertia\Testing\AssertableInertia;
use Tests\Support\CommitsHookRows;
use Tests\Support\Connections\ConnectsProjects;
use Tests\TestCase;

/**
 * The owner's Connect a project window: whether it may issue lines and every connected folder with its state; an
 * issued line never reaches the page, and anyone else sees none of it.
 */
final class ConnectProjectWindowTest extends TestCase
{
    use CommitsHookRows;
    use ConnectsProjects;

    private const array TABLES = [
        'command_receipts', 'connection_audits', 'project_invitations', 'install_attempts', 'project_bindings',
        'project_environments', 'projects', 'agent_runtimes', 'agents', 'hosts', 'settings_records', 'users',
    ];

    public function test_the_owner_sees_the_server_its_bindings_and_never_an_issued_line(): void
    {
        $this->issueLine('the-ticket');
        $this->redeemLine('the-ticket', 'nonce-aaaaaaaaaaaaaaaa')->assertCreated();
        $issued = $this->issuedLine(['issuanceKey' => 'action-1']);

        $page = $this->actingAs($this->owner)->get('/connections')->assertOk()->assertInertia(fn (
            AssertableInertia $page,
        ) => $page
            ->component('connections/ConnectProjectWindow')
            ->where('page.data.serverName', 'journal.example.com')
            ->where('page.data.origin', 'https://journal.example.com')
            ->where('page.data.canIssue', true)
            ->where('page.data.projects.0.label', 'Shop')
            ->where('page.data.projects.0.environments.0.label', 'Main')
            ->where('page.data.release.targets.0.name', 'darwin-arm64')
            ->where('page.data.release.targets.0.bytes', 9_000_000)
            ->where('page.data.release.targets.0.prerequisites', ['git', 'curl'])
            ->where('page.data.release.missingCapabilities', [])
            ->has('page.data.attempts.rows', 2)
            ->where('page.data.attempts.rows.0.state', 'open')
            ->has('page.data.bindings.rows', 1)
            ->where('page.data.bindings.rows.0.projectLabel', 'Shop')
            ->where('page.data.bindings.rows.0.machineLabel', 'Owner laptop')
            ->where('page.data.bindings.rows.0.environmentLabel', 'Main')
            ->where('page.data.bindings.rows.0.stateText', 'Waiting for first contact.')
            ->where('page.data.bindings.rows.0.state', 'pending'));

        $this->assertStringNotContainsString((string) $issued['installLine'], (string) $page->getContent());
        $this->assertStringNotContainsString('/Users/owner/shop', (string) $page->getContent());
    }

    public function test_a_ready_folder_offers_start_for_claude_code_only_and_names_why_codex_is_unavailable(): void
    {
        $this->issueLine('the-ticket');
        $binding = (string) $this->redeemLine('the-ticket', 'nonce-aaaaaaaaaaaaaaaa')->assertCreated()->json('bindingId');
        $this->reportClaudeCode('nonce-aaaaaaaaaaaaaaaa', $binding);

        $this->actingAs($this->owner)->get('/connections')->assertOk()->assertInertia(fn (
            AssertableInertia $page,
        ) => $page
            ->where('page.data.bindings.rows.0.state', 'ready')
            ->where('page.data.bindings.rows.0.capabilities.0.driver', 'claude-code')
            ->where('page.data.bindings.rows.0.capabilities.0.canStart', true)
            ->where('page.data.bindings.rows.0.capabilities.1.driver', 'codex')
            ->where('page.data.bindings.rows.0.capabilities.1.canStart', false)
            ->where(
                'page.data.bindings.rows.0.capabilities.1.unavailableReason',
                fn (string $reason) => str_contains($reason, 'Codex does not keep its hooks to one session'),
            ));
    }

    public function test_an_ended_lease_reads_stop_unconfirmed_until_its_stop_receipt_which_counts_once(): void
    {
        $this->issueLine('the-ticket');
        $binding = (string) $this->redeemLine('the-ticket', 'nonce-aaaaaaaaaaaaaaaa')->assertCreated()->json('bindingId');
        $this->reportClaudeCode('nonce-aaaaaaaaaaaaaaaa', $binding);
        $runtime = '01JAAAAAAAAAAAAAAAAAAAAAAA';
        ProjectBinding::query()->findOrFail($binding)->holdLease($runtime, CarbonImmutable::now()->subMinute());

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

    public function test_thirty_folders_page_as_twenty_five_then_five_and_an_expired_presence_reads_offline(): void
    {
        $project = Project::create('shop', 'Shop');
        $environment = Environment::openDefaultOf($project);
        $host = Host::create('laptop', 'secret-'.bin2hex(random_bytes(4)), [], ArrangementType::Local);

        foreach (range(1, 30) as $number) {
            ProjectBinding::create(
                $host,
                $project,
                $environment,
                Agent::create("Shop agent {$number}", 'main-agent'),
                new BindingFolder("root-{$number}", "/Users/owner/shop-{$number}", 'Owner laptop', "nonce-{$number}")
            );
        }

        $expired = ProjectBinding::query()->orderBy('created_at')->orderBy('id')->firstOrFail();
        ProjectBinding::query()->whereKey($expired->id)->update([
            'readiness' => 'ready',
            'presence_expires_at' => CarbonImmutable::now()->subMinute(),
        ]);

        $first = $this->actingAs($this->owner)->get('/connections')->assertOk();
        $first->assertInertia(fn (AssertableInertia $page) => $page
            ->has('page.data.bindings.rows', 25)
            ->where('page.data.bindings.rows.0.state', 'offline')
            ->where('page.data.bindings.refreshAt', null)
            ->whereType('page.data.bindings.nextCursor', 'string'));
        $cursor = (string) $first->viewData('page')['props']['page']['data']['bindings']['nextCursor'];

        $this->actingAs($this->owner)->get('/connections?bindings='.urlencode($cursor))->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->has('page.data.bindings.rows', 5)
                ->where('page.data.bindings.nextCursor', null));
    }

    public function test_someone_other_than_the_owner_sees_no_window(): void
    {
        $other = User::factory()->create();

        $this->assertFalse($this->actingAs($other)->get('/connections')->isOk());
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
