<?php

declare(strict_types=1);

namespace Tests\Feature\Processes;

use App\Contracts\Admission\ShellAdmission;
use App\Contracts\Time\VerificationTiming;
use App\Enums\AdmissionRefusalCode;
use App\Enums\ShellDialect;
use App\Models\CommandRules\CommandRequest;
use App\Models\Runs\ProcessRun;
use App\Values\Admission;
use App\Values\AdmissionRefusal;
use App\Values\ExecutionContext;
use App\Values\TimingVerdict;
use Illuminate\Support\Facades\Schema;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * One admission decides a whole shell line before anything starts: known, permitted, timed and, for a check, backed by
 * an approved proven reader; unknown work is held in a command request.
 */
final class LineAdmissionTest extends TestCase
{
    use RefreshHookDatabase;

    private const string PROPOSE_COMMAND = 'journal command-type propose';

    private const string BLOCKING_TASKS = 'task 447, task 448';

    private const string NOTICE = 'Nothing in this request started.';

    private TestStart $start;

    protected function setUp(): void
    {
        parent::setUp();

        config(['processes.runner' => true]);
        $this->start = TestStart::start();
    }

    public function test_a_known_line_is_admitted_once_as_a_queued_run_and_the_same_key_returns_it(): void
    {
        $first = $this->admit('cat composer.json', 'key-1');

        $this->assertTrue($first->isAllowed());
        $this->assertSame(1, ProcessRun::query()->withoutGlobalScopes()->count());
        $this->assertSame($first->runId, $this->admit('cat composer.json', 'key-1')->runId);
        $reused = $this->refusalOf($this->admit('cat README.md', 'key-1'));
        $this->assertSame(AdmissionRefusalCode::RuleRevisionChanged, $reused->code);
    }

    public function test_an_unknown_command_is_refused_and_held_in_its_request(): void
    {
        $refusal = $this->refusalOf($this->admit('acme verify --all', 'key-1'));

        $this->assertSame(AdmissionRefusalCode::CommandUnknown, $refusal->code);
        $this->assertSame(CommandRequest::query()->sole()->id, $refusal->requestId);
        $this->assertStringStartsWith(self::PROPOSE_COMMAND, $refusal->next);
        $this->assertSame(0, ProcessRun::query()->withoutGlobalScopes()->count());
    }

    public function test_a_check_without_an_approved_proven_reader_is_refused_as_reader_required(): void
    {
        $refusal = $this->refusalOf($this->admit('vendor/bin/phpstan analyse', 'key-1'));

        $this->assertSame(AdmissionRefusalCode::ReaderRequired, $refusal->code);
        $this->assertNotSame('', $refusal->requestId);
    }

    public function test_a_check_between_the_tasks_of_a_phase_is_refused_as_phase_timing(): void
    {
        $this->app->scoped(VerificationTiming::class, fn () => new class implements VerificationTiming
        {
            public function forCaller(): TimingVerdict
            {
                return TimingVerdict::refused(14, 3, [447, 448]);
            }
        });

        $refusal = $this->refusalOf($this->admit('vendor/bin/phpstan analyse', 'key-1'));

        $this->assertSame(AdmissionRefusalCode::PhaseTiming, $refusal->code);
        $this->assertStringContainsString(self::BLOCKING_TASKS, $refusal->reason);
    }

    public function test_a_read_only_helper_writing_a_file_is_refused_by_its_ceiling(): void
    {
        $this->start = TestStart::start('read-only-helper');

        $refusal = $this->refusalOf($this->admit('cat composer.json > copy.json', 'key-1'));

        $this->assertSame(AdmissionRefusalCode::ClassDenied, $refusal->code);
        $this->assertSame(0, ProcessRun::query()->withoutGlobalScopes()->count());
    }

    public function test_a_switched_off_runner_and_a_broken_rule_store_refuse_before_anything_starts(): void
    {
        config(['processes.runner' => false]);
        $switchedOff = $this->refusalOf($this->admit('cat composer.json', 'key-1'));
        $this->assertSame(AdmissionRefusalCode::RunnerUnavailable, $switchedOff->code);
        $this->assertSame(0, ProcessRun::query()->withoutGlobalScopes()->count());

        Schema::drop('module_rule_bundles');
        $broken = $this->refusalOf($this->admit('cat composer.json', 'key-2'));

        $this->assertSame(AdmissionRefusalCode::ClassificationUnavailable, $broken->code);
    }

    public function test_a_secret_in_an_assignment_never_shows_in_the_refusal(): void
    {
        $refusal = $this->refusalOf($this->admit('TOKEN=hunter2 acme verify', 'key-1'));

        $this->assertStringNotContainsString('hunter2', $refusal->excerpt);
        $this->assertSame(self::NOTICE, AdmissionRefusal::NOTICE);
    }

    private function admit(string $line, string $key): Admission
    {
        $this->start->startRequest($this->app);

        return $this->app->make(ShellAdmission::class)
            ->admit($line, ShellDialect::Bash, ExecutionContext::inFolder(base_path()), $key);
    }

    private function refusalOf(Admission $admission): AdmissionRefusal
    {
        $this->assertFalse($admission->isAllowed());
        $refusal = $admission->decision;
        $this->assertInstanceOf(AdmissionRefusal::class, $refusal);

        return $refusal;
    }
}
