<?php

declare(strict_types=1);

namespace Tests\Commands\Projects;

use App\Models\Projects\DeviceGrant;
use Domain\Tasks\TasksDomain;
use Illuminate\Support\Str;
use Illuminate\Testing\TestResponse;
use Inertia\Testing\AssertableInertia;
use Tests\Support\CommitsHookRows;
use Tests\Support\Connections\ConnectsProjects;
use Tests\Support\DomainBoot;
use Tests\TestCase;

/**
 * The shell gets a url and a code and its grant once the owner approves; the approval window reads the committed
 * state of the request.
 */
final class ApproveDeviceGrantTest extends TestCase
{
    use CommitsHookRows;
    use ConnectsProjects;

    private const array TABLES = [
        'assignments', 'tasks', 'command_receipts', 'device_grants', 'connection_audits', 'project_invitations',
        'install_attempts', 'project_bindings', 'project_environments', 'projects', 'agent_runtimes', 'agents', 'hosts',
        'settings_records', 'users',
    ];

    private const string NONCE = 'nonce-aaaaaaaaaaaaaaaa';

    /**
     * The domains this test uses beside core.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(TasksDomain::class);
    }

    public function test_the_shell_gets_a_url_and_code_and_its_grant_once_the_owner_approves(): void
    {
        $binding = $this->connected();

        $start = $this->relay('/api/device-grants', ['binding' => $binding])->assertCreated();
        $this->assertStringStartsWith('https://journal.example.com/connections/devices/', (string) $start->json('approvalUrl'));
        $this->relay('/api/device-grants/poll', ['deviceCode' => $start->json('deviceCode')])->assertStatus(428);

        $this->travel(DeviceGrant::POLL_SECONDS_MINIMUM + 1)->seconds();
        $this->actingAs($this->owner)
            ->post("/project-connections/devices/{$start->json('userCode')}/approve")
            ->assertRedirect();
        $grant = $this->relay('/api/device-grants/poll', ['deviceCode' => $start->json('deviceCode')])->assertOk();

        $this->assertNotEmpty($grant->json('grant'));
        $this->assertStringNotContainsString((string) $grant->json('grant'), (string) json_encode(DeviceGrant::query()->sole()->getAttributes()));
    }

    public function test_the_approval_window_reads_the_committed_state_of_the_request(): void
    {
        $binding = $this->connected();
        $start = $this->relay('/api/device-grants', ['binding' => $binding, 'startKey' => 'start-1'])->assertCreated();
        $window = "/connections/devices/{$start->json('userCode')}";

        $this->actingAs($this->owner)->get($window)->assertOk()->assertInertia(fn (AssertableInertia $page) => $page
            ->where('page.data.state', 'pending')
            ->where('page.data.journalOrigin', 'https://journal.example.com')
            ->where('page.data.isBindingRevoked', false));
        $this->actingAs($this->owner)->post("/project-connections/devices/{$start->json('userCode')}/approve");

        $this->actingAs($this->owner)->get($window)->assertOk()->assertInertia(fn (AssertableInertia $page) => $page
            ->where('page.data.state', 'approved'));
        $this->actingAs($this->owner)
            ->postJson("/project-connections/devices/{$start->json('userCode')}/approve")
            ->assertNotFound();
    }

    private function connected(): string
    {
        $this->issueLine('the-ticket');

        return (string) $this->redeemLine('the-ticket', self::NONCE)->assertCreated()->json('bindingId');
    }

    /**
     * @param  array<string, mixed>  $body
     */
    private function relay(string $target, array $body): TestResponse
    {
        return $this->signedRelayCall(
            $this->relayCredential(self::NONCE),
            $target,
            $body,
            (string) Str::uuid(),
        );
    }
}
