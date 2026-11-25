<?php

declare(strict_types=1);

namespace Tests\Feature\Connections;

use App\Api\Connections\ProjectCommandFrame;
use App\Enums\Connections\BindingReadiness;
use App\Enums\Connections\CommandRunStatus;
use App\Enums\Projects\ArrangementType;
use App\Exceptions\DeviceGrantRefused;
use App\Models\Access\User;
use App\Models\Projects\DeviceGrant;
use App\Models\Projects\Environment;
use App\Models\Projects\Host;
use App\Models\Projects\ProjectBinding;
use App\Models\Projects\ProjectCommandRun;
use App\Support\Access\AccessSettings;
use App\Values\BindingFolder;
use App\Values\CommandFingerprint;
use App\Values\InstallTicket;
use App\Values\PresenceReport;
use Domain\Comments\CommentsDomain;
use Illuminate\Testing\TestResponse;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\CommitsHookRows;
use Tests\Support\DomainBoot;
use Tests\Support\SendsSignedPayloads;
use Tests\TestCase;

/**
 * A connected machine's journal verbs run on the server under the calling start's own token: only journal verbs of
 * the caller's own binding run, a repeated request id answers its first result, and a host credential alone is
 * refused.
 */
final class ProjectCommandsTest extends TestCase
{
    use CommitsHookRows;
    use SendsSignedPayloads;

    private const string SECRET_TASKS = 'Secret tasks';

    private const array TABLES = [
        'project_command_runs', 'device_grants', 'connection_audits', 'command_receipts', 'project_bindings',
        'project_environments', 'projects', 'agent_runtimes', 'agent_sessions', 'session_tokens', 'agents', 'hosts',
        'settings_records', 'users',
    ];

    /**
     * Comments, whose verbs the connected machine runs.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(CommentsDomain::class);
    }

    /**
     * A process id no process holds: above what the systems this runs on hand out.
     */
    private const int GONE_PROCESS = 4_194_305;

    public function test_a_repeated_request_key_answers_the_first_result_without_running_again(): void
    {
        [$start, $binding] = $this->connectedStart();
        $run = $this->recordedRun('request-1', $start, $binding, 'live-worker');
        $run->finish([ProjectCommandFrame::output(1, 'stdout', "Tasks\n"), ProjectCommandFrame::exit(2, 3)], 3);

        $reply = $this->command($start, 'request-1', $binding->id, ['comment', 'list'])->assertOk();

        $frames = $reply->json('frames');
        $this->assertSame("Tasks\n", $frames[0]['text']);
        $this->assertSame(['sequence' => 2, 'stream' => 'exit', 'text' => '', 'isBase64' => false, 'exitCode' => 3], $frames[1]);
        $this->assertSame(1, ProjectCommandRun::query()->count());
    }

    public function test_a_request_id_asked_again_with_other_piped_input_is_refused_without_output(): void
    {
        [$start, $binding] = $this->connectedStart();
        $run = $this->recordedRun('request-1', $start, $binding, 'live-worker');
        $run->finish([ProjectCommandFrame::output(1, 'stdout', "Secret tasks\n"), ProjectCommandFrame::exit(2, 0)], 0);

        $reply = $this->command($start, 'request-1', $binding->id, ['comment', 'list'], 'other input')->assertConflict();

        $this->assertStringNotContainsString(self::SECRET_TASKS, (string) $reply->getContent());
        $this->assertNull($reply->json('frames'));
        $this->assertSame(CommandRunStatus::Completed, $run->fresh()?->status);
    }

    public function test_a_run_whose_worker_died_reads_interrupted_or_unknown_and_is_never_run_again(): void
    {
        [$start, $binding] = $this->connectedStart();
        $deadWorker = gethostname().':'.self::GONE_PROCESS;
        $interrupted = $this->recordedRun('request-1', $start, $binding, $deadWorker);
        $interrupted->recordProcess(self::GONE_PROCESS);
        $unknown = $this->recordedRun('request-2', $start, $binding, $deadWorker);

        $this->command($start, 'request-1', $binding->id, ['comment', 'list'])->assertConflict()
            ->assertJsonPath('message', fn (string $message) => str_contains($message, 'interrupted'));
        $this->command($start, 'request-2', $binding->id, ['comment', 'list'])->assertConflict()
            ->assertJsonPath('message', fn (string $message) => str_contains($message, 'unknown'));

        $this->assertSame(CommandRunStatus::Interrupted, $interrupted->fresh()?->status);
        $this->assertSame(CommandRunStatus::Unknown, $unknown->fresh()?->status);
        $this->assertSame(2, ProjectCommandRun::query()->count());
    }

    public function test_a_request_ids_status_answers_its_frames_and_exit_code_and_refuses_another_binding(): void
    {
        [$start, $binding] = $this->connectedStart();
        [, $other] = $this->connectedStart();
        $run = $this->recordedRun('request-1', $start, $binding, 'live-worker');
        $run->finish([ProjectCommandFrame::output(1, 'stdout', "Tasks\n"), ProjectCommandFrame::exit(2, 3)], 3);

        $status = $this->readStatus($start, 'request-1', $binding->id)->assertOk();

        $this->assertSame('failed', $status->json('state'));
        $this->assertSame("Tasks\n", $status->json('frames.0.text'));
        $this->assertSame(3, $status->json('frames.1.exitCode'));
        $this->readStatus($start, 'request-1', $other->id)->assertForbidden();
        $this->assertSame('unknown', $this->readStatus($start, 'request-9', $binding->id)->assertOk()->json('state'));
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
        $stream = $this->recordedRun('request-1', $start, $binding, 'live-worker');
        $otherStream = $this->recordedRun('request-2', $otherStart, $other, 'live-worker');
        $grant = DeviceGrant::create($binding, InstallTicket::digestOf('device-code'), 'ABCD-EFGH', 'start-1');
        $grant->issue(InstallTicket::digestOf('device-grant'));

        $owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));
        $this->actingAs($owner)->deleteJson("/project-connections/bindings/{$binding->id}")->assertOk();

        $this->command($start, 'request-3', $binding->id, ['comment', 'list'])->assertUnauthorized();
        $this->expectException(DeviceGrantRefused::class);

        try {
            DeviceGrant::findUsableByDigest(InstallTicket::digestOf('device-grant'));
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
        $project = $this->localProject();
        $binding = ProjectBinding::create(
            $host,
            $project,
            Environment::create($project, 'Binding '.bin2hex(random_bytes(3))),
            $start->agent,
            new BindingFolder('root-'.bin2hex(random_bytes(4)), '/Users/owner/shop', 'Owner laptop', bin2hex(random_bytes(8))),
        );
        $binding->recordPresence(new PresenceReport(
            'boot-1',
            1,
            '1.0.0',
            true,
            false,
            0,
            [],
            true,
        ));

        return [$start, $binding];
    }

    /**
     * A run of journal comment list with nothing piped in, kept under the request id as the given worker runs it; a
     * worker of another server counts as alive.
     */
    private function recordedRun(
        string $requestKey,
        TestStart $start,
        ProjectBinding $binding,
        string $worker,
    ): ProjectCommandRun {
        $argv = ['comment', 'list'];

        return ProjectCommandRun::create(
            $requestKey,
            $start->agent->id,
            $binding,
            $argv,
            CommandFingerprint::of($argv, '', $binding->id, $start->agent->id),
            $worker,
        );
    }

    private function readStatus(TestStart $start, string $requestKey, string $bindingId): TestResponse
    {
        return $this->signed($start, '/api/project-commands/status', [
            'request_key' => $requestKey,
            'binding' => $bindingId,
        ]);
    }

    /**
     * @param  list<string>  $argv
     */
    private function command(
        TestStart $start,
        string $requestKey,
        string $bindingId,
        array $argv,
        string $stdin = '',
    ): TestResponse {
        return $this->signed($start, '/api/project-commands', [
            'request_key' => $requestKey,
            'binding' => $bindingId,
            'argv' => $argv,
            'stdin' => $stdin,
        ]);
    }
}
