<?php

declare(strict_types=1);

namespace Tests\Commands\Projects;

use App\Commands\Projects\RecordProjectCommandProcess\RecordProjectCommandProcessCommand;
use App\Enums\Projects\ArrangementType;
use App\Models\Projects\Environment;
use App\Models\Projects\Host;
use App\Models\Projects\ProjectBinding;
use App\Models\Projects\ProjectCommandRun;
use App\Values\BindingFolder;
use App\Values\CommandFingerprint;
use App\Values\PresenceReport;
use Domain\Comments\CommentsDomain;
use Illuminate\Testing\TestResponse;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\CommitsHookRows;
use Tests\Support\DomainBoot;
use Tests\Support\RunsTrustedCommands;
use Tests\Support\SendsSignedPayloads;
use Tests\TestCase;

/**
 * The journal keeps the process id a project command runs under, on its run.
 */
final class RecordProjectCommandProcessTest extends TestCase
{
    use CommitsHookRows;
    use RunsTrustedCommands;
    use SendsSignedPayloads;

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

    public function test_the_process_id_is_kept_on_the_run(): void
    {
        [$start, $binding] = $this->connectedStart();
        $run = $this->recordedRun('request-1', $start, $binding, gethostname().':'.getmypid());

        $this->asSystem(new RecordProjectCommandProcessCommand('request-1', 4242));

        $this->assertSame(4242, $run->fresh()?->pid);
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
