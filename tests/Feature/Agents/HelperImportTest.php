<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Commands\Agents\ImportHelperCommits\ImportHelperCommitsCommand;
use App\Commands\Agents\ImportHelperCommits\ImportHelperCommitsHandler;
use App\Exceptions\HelperWorkUncertified;
use App\Support\RecordIdentity;
use App\Values\HelperImportReceipt;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\Agents\CertifiesHelperWork;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * A parent imports a helper's certified commits through a trusted operation: a certified writer's two
 * commits land under the work's ref without any hook running and without changing a branch, uncertified work is
 * refused, and repeating the import changes nothing.
 */
#[TimeLimit(seconds: 6, reason: 'It builds two git repositories and fetches between them.')]
final class HelperImportTest extends TestCase
{
    use CertifiesHelperWork;
    use RefreshHookDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->buildHelperRepositories();
    }

    protected function tearDown(): void
    {
        $this->removeHelperRepositories();

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

    private function certify(string $certificate): void
    {
        $this->certifyHelperWork(TestStart::start('writing-helper'), $certificate);
    }

    private function import(string $certificate): HelperImportReceipt
    {
        $command = new ImportHelperCommitsCommand(new RecordIdentity('helpers.job', self::WORK_ID), $certificate);

        return $this->app->make(ImportHelperCommitsHandler::class)->handle($command);
    }
}
