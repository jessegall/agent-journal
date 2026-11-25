<?php

declare(strict_types=1);

namespace Tests\Commands\Projects;

use App\Commands\Projects\PollDeviceGrant\PollDeviceGrantCommand;
use App\Models\Projects\DeviceGrant;
use Domain\Tasks\TasksDomain;
use Illuminate\Support\Str;
use Illuminate\Testing\TestResponse;
use Tests\Support\CommitsHookRows;
use Tests\Support\Connections\ConnectsProjects;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\TestCase;

/**
 * A terminal polls its device grant: an expired code is refused, a poll too soon slows down and keeps the request
 * waiting, and a lost successful poll answers already issued with the reference.
 */
#[TestsCommand(PollDeviceGrantCommand::class)]
final class PollDeviceGrantTest extends TestCase
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

    public function test_an_expired_code_is_refused(): void
    {
        $binding = $this->connected();
        $start = $this->relay('/api/device-grants', ['binding' => $binding])->assertCreated();

        $this->travel(DeviceGrant::CODE_MINUTES + 1)->minutes();

        $this->actingAs($this->owner)
            ->postJson("/project-connections/devices/{$start->json('userCode')}/approve")
            ->assertNotFound();
        $expired = $this->relay('/api/device-grants/poll', ['deviceCode' => $start->json('deviceCode')])->assertStatus(410);
        $this->assertSame('expired_token', $expired->json('details.outcome'));
    }

    public function test_a_poll_too_soon_slows_down_and_keeps_the_request_waiting(): void
    {
        $binding = $this->connected();
        $start = $this->relay('/api/device-grants', ['binding' => $binding, 'startKey' => 'start-1'])->assertCreated();
        $this->relay('/api/device-grants/poll', ['deviceCode' => $start->json('deviceCode')])->assertStatus(428);

        $slow = $this->relay('/api/device-grants/poll', ['deviceCode' => $start->json('deviceCode')])->assertStatus(429);

        $this->assertSame('slow_down', $slow->json('details.outcome'));
        $this->assertSame(DeviceGrant::POLL_SECONDS_MINIMUM, $slow->json('details.interval'));
        $this->travel(DeviceGrant::POLL_SECONDS_MINIMUM + 1)->seconds();
        $pending = $this->relay('/api/device-grants/poll', ['deviceCode' => $start->json('deviceCode')])->assertStatus(428);
        $this->assertSame('authorization_pending', $pending->json('details.outcome'));
    }

    public function test_a_lost_successful_poll_answers_already_issued_with_the_reference(): void
    {
        $binding = $this->connected();
        $start = $this->relay('/api/device-grants', ['binding' => $binding, 'startKey' => 'start-1'])->assertCreated();
        $this->actingAs($this->owner)->post("/project-connections/devices/{$start->json('userCode')}/approve");
        $this->app['auth']->forgetGuards();
        $issued = $this->relay('/api/device-grants/poll', ['deviceCode' => $start->json('deviceCode')])->assertOk();

        $this->travel(DeviceGrant::POLL_SECONDS_MINIMUM + 1)->seconds();
        $again = $this->relay('/api/device-grants/poll', ['deviceCode' => $start->json('deviceCode')])->assertStatus(409);

        $this->assertSame('issued', $issued->json('outcome'));
        $this->assertSame('already_issued', $again->json('details.outcome'));
        $this->assertSame($start->json('reference'), $again->json('details.reference'));
        $this->assertNull($again->json('grant'));
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
