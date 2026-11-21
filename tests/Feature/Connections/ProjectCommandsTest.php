<?php

declare(strict_types=1);

namespace Tests\Feature\Connections;

use App\Agents\Enums\ArrangementType;
use App\Agents\Models\Host;
use App\Connections\Enums\BindingReadiness;
use App\Connections\Exceptions\DeviceGrantRefused;
use App\Connections\Models\DeviceGrant;
use App\Connections\Models\Environment;
use App\Connections\Models\Project;
use App\Connections\Models\ProjectBinding;
use App\Connections\Models\ProjectCommandRun;
use App\Connections\Values\BindingFolder;
use App\Connections\Values\CommandFrame;
use App\Connections\Values\InstallTicket;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Illuminate\Testing\TestResponse;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\CommitsHookRows;
use Tests\Support\SendsSignedCalls;
use Tests\TestCase;

/**
 * A connected machine's journal verbs run on the server under the calling start's own token: only journal verbs of
 * the caller's own binding run, a repeated request id answers its first result, and a host credential alone is
 * refused.
 */
final class ProjectCommandsTest extends TestCase
{
    use CommitsHookRows;
    use SendsSignedCalls;

    private const array TABLES = [
        'project_command_runs', 'device_grants', 'connection_audits', 'command_receipts', 'project_bindings',
        'project_environments', 'projects', 'agent_runtimes', 'agent_sessions', 'start_tokens', 'agents', 'hosts',
        'settings_records', 'users',
    ];

    public function test_a_repeated_request_key_answers_the_first_result_without_running_again(): void
    {
        [$start, $binding] = $this->connectedStart();
        $run = ProjectCommandRun::create('request-1', $start->agent->id, $binding, ['comment', 'list']);
        $run->finish([CommandFrame::output(1, 'stdout', "Tasks\n"), CommandFrame::exit(2, 3)], 3);

        $reply = $this->command($start, 'request-1', $binding->id, ['comment', 'list'])->assertOk();

        $frames = $reply->json('frames');
        $this->assertSame("Tasks\n", $frames[0]['text']);
        $this->assertSame(['sequence' => 2, 'stream' => 'exit', 'text' => '', 'isBase64' => false, 'exitCode' => 3], $frames[1]);
        $this->assertSame(1, ProjectCommandRun::query()->count());
    }

    public function test_a_verb_that_is_no_journal_route_is_refused(): void
    {
        [$start, $binding] = $this->connectedStart();

        $this->command($start, 'request-1', $binding->id, ['migrate', 'fresh'])->assertForbidden();

        $this->assertSame(0, ProjectCommandRun::query()->count());
    }

    public function test_another_agents_binding_is_refused(): void
    {
        [$start] = $this->connectedStart();
        [, $other] = $this->connectedStart();

        $this->command($start, 'request-1', $other->id, ['comment', 'list'])->assertForbidden();
    }

    public function test_a_revoke_refuses_the_agents_token_and_device_grant_and_ends_its_streams_only(): void
    {
        [$start, $binding] = $this->connectedStart();
        [$otherStart, $other] = $this->connectedStart();
        $stream = ProjectCommandRun::create('request-1', $start->agent->id, $binding, ['comment', 'list']);
        $otherStream = ProjectCommandRun::create('request-2', $otherStart->agent->id, $other, ['comment', 'list']);
        $grant = DeviceGrant::create($binding, InstallTicket::digestOf('device-code'), 'ABCD-EFGH', 'start-1');
        $grant->issue(InstallTicket::digestOf('device-grant'));

        $owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));
        $this->actingAs($owner)->deleteJson("/settings/project-connections/bindings/{$binding->id}")->assertNoContent();

        $this->command($start, 'request-3', $binding->id, ['comment', 'list'])->assertUnauthorized();
        $this->expectException(DeviceGrantRefused::class);

        try {
            DeviceGrant::usableByDigest(InstallTicket::digestOf('device-grant'));
        } finally {
            $this->assertFalse($stream->fresh()?->isRunning());
            $this->assertTrue($otherStream->fresh()?->isRunning());
            $this->assertNotSame(BindingReadiness::Revoked, $other->fresh()?->readiness);
        }
    }

    public function test_a_host_credential_alone_is_refused(): void
    {
        $this->postJson('/api/project-commands', [
            'request_key' => 'request-1',
            'binding' => '01JAAAAAAAAAAAAAAAAAAAAAAA',
            'argv' => ['comment', 'list'],
            'stdin' => '',
        ], ['Authorization' => 'Bearer a-host-secret'])->assertUnauthorized();
    }

    /**
     * @return array{TestStart, ProjectBinding}
     */
    private function connectedStart(): array
    {
        $start = TestStart::start();
        $host = Host::create('laptop', 'secret-'.bin2hex(random_bytes(4)), [], ArrangementType::Local);
        $project = Project::create('shop-'.bin2hex(random_bytes(3)), 'Shop');
        $binding = ProjectBinding::create(
            $host,
            $project,
            Environment::openDefaultOf($project),
            $start->agent,
            new BindingFolder('root-'.bin2hex(random_bytes(4)), '/Users/owner/shop', 'Owner laptop', bin2hex(random_bytes(8))),
        );

        return [$start, $binding];
    }

    /**
     * @param  list<string>  $argv
     */
    private function command(TestStart $start, string $requestKey, string $bindingId, array $argv): TestResponse
    {
        return $this->signed($start, '/api/project-commands', [
            'request_key' => $requestKey,
            'binding' => $bindingId,
            'argv' => $argv,
            'stdin' => '',
        ]);
    }
}
