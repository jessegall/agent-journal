<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Actors\Support\ActorIdentity;
use App\Agents\Commands\ImportHelperCommits;
use App\Agents\Enums\ConversationModeType;
use App\Agents\Enums\ExecutionModeType;
use App\Agents\Enums\StartOriginType;
use App\Agents\Exceptions\HelperWorkUncertified;
use App\Agents\Handlers\ImportHelperCommitsHandler;
use App\Agents\Models\CertifiedWork;
use App\Agents\Models\SessionPolicy;
use App\Agents\Models\StartRecord;
use App\Agents\Support\ExecutionBudgets;
use App\Agents\Support\ExecutionPolicy;
use App\Agents\Support\HelperCommitImport;
use App\Agents\Support\ModelSelection;
use App\Agents\Support\SelectedProgram;
use App\Agents\Support\StartPolicy;
use App\Agents\Support\StartRequest;
use App\Agents\Values\HelperImportReceipt;
use App\Records\Support\RecordIdentity;
use Illuminate\Process\Factory;
use Illuminate\Support\Facades\File;
use PhpOption\None;
use Symfony\Component\Process\Process;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * A parent imports a helper's certified commits through a trusted operation (task 424): a certified writer's two
 * commits land under the work's ref without any hook running and without changing a branch, uncertified work is
 * refused, and repeating the import changes nothing.
 */
#[TimeLimit(seconds: 6, reason: 'It builds two git repositories and fetches between them.')]
final class HelperImportTest extends TestCase
{
    use RefreshHookDatabase;

    private const string WORK_ID = '01m7wgahp0n7766x1e1ta8ehew';

    private string $folder;

    protected function setUp(): void
    {
        parent::setUp();

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

    protected function tearDown(): void
    {
        File::deleteDirectory($this->folder);

        parent::tearDown();
    }

    public function test_a_certified_writer_has_its_two_commits_under_the_work_ref_and_no_hook_runs(): void
    {
        $this->certify('attempt-1');
        $branchBefore = $this->git("{$this->folder}/parent", 'rev-parse', 'version-6');

        $receipt = $this->import('attempt-1');

        $this->assertSame('refs/helpers/helpers.job/'.self::WORK_ID.'/attempt-1', $receipt->ref);
        $this->assertCount(2, $receipt->commits);
        $this->assertSame($this->git("{$this->folder}/helper", 'rev-parse', 'HEAD'), $receipt->commits[1]);
        $this->assertSame($branchBefore, $this->git("{$this->folder}/parent", 'rev-parse', 'version-6'));
        $this->assertFileDoesNotExist("{$this->folder}/hook-ran");
    }

    public function test_repeating_the_import_changes_nothing(): void
    {
        $this->certify('attempt-1');
        $first = $this->import('attempt-1');
        $this->commit("{$this->folder}/helper", 'a later change');

        $again = $this->import('attempt-1');

        $this->assertEquals($first, $again);
    }

    public function test_uncertified_work_is_refused(): void
    {
        $this->certify('attempt-1');

        $this->expectException(HelperWorkUncertified::class);

        $this->import('attempt-2');
    }

    /**
     * A helper launch for the job, its policy frozen on the helper checkout, certified by the attempt.
     */
    private function certify(string $certificate): void
    {
        $launch = TestStart::start('writing-helper');
        $execution = ExecutionPolicy::make(
            ExecutionModeType::ProtectedHost,
            null,
            "{$this->folder}/helper",
            ExecutionBudgets::defaults(),
            [],
        );
        $request = new StartRequest(
            $launch->session->start_request_id,
            $launch->agent->id,
            SelectedProgram::resolve('claude-code', ModelSelection::named('claude-opus-5-5'), null, null),
            StartOriginType::OwnerRequest,
            'helpers.job:'.self::WORK_ID,
            null,
            ConversationModeType::New,
            null,
            StartPolicy::withoutProfile($execution),
        );
        $start = StartRecord::accept($request, ActorIdentity::system(), None::create());
        $start->startedAs($launch->session);
        SessionPolicy::freeze($launch->session, $request->policy);
        CertifiedWork::record($start->refresh(), $certificate);
    }

    private function import(string $certificate): HelperImportReceipt
    {
        $command = new ImportHelperCommits(new RecordIdentity('helpers.job', self::WORK_ID), $certificate);

        return $this->app->make(ImportHelperCommitsHandler::class)->handle($command);
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
