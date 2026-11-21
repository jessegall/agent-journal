<?php

declare(strict_types=1);

namespace Tests\Support\Agents;

use App\Actors\Support\ActorIdentity;
use App\Agents\Enums\ConversationModeType;
use App\Agents\Enums\ExecutionModeType;
use App\Agents\Enums\StartOriginType;
use App\Agents\Models\CertifiedWork;
use App\Agents\Models\SessionPolicy;
use App\Agents\Models\StartRecord;
use App\Agents\Support\HelperCommitImport;
use App\Agents\Values\ExecutionBudgets;
use App\Agents\Values\ExecutionPolicy;
use App\Agents\Values\ModelSelection;
use App\Agents\Values\SelectedProgram;
use App\Agents\Values\StartPolicy;
use App\Agents\Values\StartRequest;
use App\Records\Support\RecordIdentity;
use Illuminate\Process\Factory;
use Illuminate\Support\Facades\File;
use PhpOption\None;
use Symfony\Component\Process\Process;
use Tests\Fixtures\Agents\TestStart;

/**
 * A parent repository and a helper's clone with two commits of its own, imported through the real helper import, and
 * a launch for a helper job certified on that clone.
 */
trait CertifiesHelperWork
{
    private const string WORK_ID = '01m7wgahp0n7766x1e1ta8ehew';

    private string $folder;

    private function buildHelperRepositories(): void
    {
        $this->folder = sys_get_temp_dir().'/helper-import-'.getmypid().'-'.bin2hex(random_bytes(4));
        File::ensureDirectoryExists($this->folder);
        $this->git($this->folder, 'init', '--quiet', '--initial-branch=version-6', 'parent');
        $this->commit("{$this->folder}/parent", 'base');
        $this->git($this->folder, 'clone', '--quiet', "{$this->folder}/parent", 'helper');
        $this->commit("{$this->folder}/helper", 'first fix');
        $this->commit("{$this->folder}/helper", 'second fix');

        foreach (['parent', 'helper'] as $repository) {
            $hook = "{$this->folder}/{$repository}/.git/hooks/reference-transaction";
            File::put($hook, "#!/bin/sh\ntouch {$this->folder}/hook-ran\n");
            chmod($hook, 0o755);
        }

        $this->app->instance(
            HelperCommitImport::class,
            new HelperCommitImport($this->app->make(Factory::class), "{$this->folder}/parent"),
        );
    }

    private function removeHelperRepositories(): void
    {
        File::deleteDirectory($this->folder);
    }

    /**
     * A helper launch for the job, its policy frozen on the helper checkout, certified by the attempt.
     */
    private function certifyHelperWork(
        TestStart $launch,
        string $certificate,
        bool $requiresReview = false,
        RecordIdentity $work = new RecordIdentity('helpers.job', self::WORK_ID),
    ): CertifiedWork {
        $execution = ExecutionPolicy::make(
            ExecutionModeType::ProtectedHost,
            null,
            "{$this->folder}/helper",
            ExecutionBudgets::defaults(),
            [],
        );
        $policy = StartPolicy::withoutProfile($execution);
        $request = new StartRequest(
            $launch->session->start_request_id,
            $launch->agent->id,
            SelectedProgram::resolve('claude-code', ModelSelection::named('claude-opus-5-5'), null, null),
            StartOriginType::OwnerRequest,
            "{$work->type}:{$work->id}",
            null,
            ConversationModeType::New,
            null,
            new StartPolicy($policy->access, $policy->stopConditions, $execution, null, null, null, $requiresReview),
        );
        $start = StartRecord::accept($request, ActorIdentity::system(), None::create());
        $start->startedAs($launch->session);
        SessionPolicy::create($launch->session, $request->policy);

        return CertifiedWork::record($start->refresh(), $certificate);
    }

    private function commit(string $repository, string $message): void
    {
        File::put("{$repository}/".str_replace(' ', '-', $message).'.txt', $message);
        $this->git($repository, 'add', '--all');
        $author = ['-c', 'user.name=Test', '-c', 'user.email=test@example.test'];
        $this->git($repository, ...$author, ...['commit', '-q', '-m', $message]);
    }

    private function git(string $folder, string ...$arguments): string
    {
        $process = new Process(['git', '-c', 'core.hooksPath=/dev/null', ...$arguments], $folder);
        $process->mustRun();

        return trim($process->getOutput());
    }
}
