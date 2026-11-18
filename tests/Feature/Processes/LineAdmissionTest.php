<?php

declare(strict_types=1);

namespace Tests\Feature\Processes;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\Processes\Contracts\ShellAdmission;
use App\Processes\Contracts\VerificationTiming;
use App\Processes\Enums\RefusalCode;
use App\Processes\Enums\ShellDialect;
use App\Processes\Models\CommandRequest;
use App\Processes\Models\ProcessRun;
use App\Processes\Values\Admission;
use App\Processes\Values\AdmissionRefusal;
use App\Processes\Values\ExecutionContext;
use App\Processes\Values\TimingVerdict;
use Illuminate\Support\Facades\Schema;
use Tests\Fixtures\Agents\TestLaunch;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * One admission decides a whole shell line before anything starts: known, permitted, timed and, for a check, backed by
 * an approved proven reader; unknown work is held in a command request (doc 21 revision 6, sections 10, 26 and 71).
 */
final class LineAdmissionTest extends TestCase
{
    use RefreshHookDatabase;

    private TestLaunch $launch;

    protected function setUp(): void
    {
        parent::setUp();

        config(['processes.runner' => true]);
        $this->launch = TestLaunch::start();
    }

    public function test_a_known_line_is_admitted_once_as_a_queued_run_and_the_same_key_returns_it(): void
    {
        $first = $this->admit('cat composer.json', 'key-1');

        $this->assertTrue($first->isAllowed());
        $this->assertSame(1, ProcessRun::query()->withoutGlobalScopes()->count());
        $this->assertSame($first->runId, $this->admit('cat composer.json', 'key-1')->runId);
        $reused = $this->refusalOf($this->admit('cat README.md', 'key-1'));
        $this->assertSame(RefusalCode::RuleRevisionChanged, $reused->code);
    }

    public function test_an_unknown_command_is_refused_and_held_in_its_request(): void
    {
        $refusal = $this->refusalOf($this->admit('acme verify --all', 'key-1'));

        $this->assertSame(RefusalCode::CommandUnknown, $refusal->code);
        $this->assertSame(CommandRequest::query()->sole()->id, $refusal->requestId);
        $this->assertStringStartsWith('journal command-type propose', $refusal->next);
        $this->assertSame(0, ProcessRun::query()->withoutGlobalScopes()->count());
    }

    public function test_a_check_without_an_approved_proven_reader_is_refused_as_reader_required(): void
    {
        $refusal = $this->refusalOf($this->admit('vendor/bin/phpstan analyse', 'key-1'));

        $this->assertSame(RefusalCode::ReaderRequired, $refusal->code);
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

        $this->assertSame(RefusalCode::PhaseTiming, $refusal->code);
        $this->assertStringContainsString('task 447, task 448', $refusal->reason);
    }

    public function test_a_switched_off_runner_and_a_broken_rule_store_refuse_before_anything_starts(): void
    {
        config(['processes.runner' => false]);
        $switchedOff = $this->refusalOf($this->admit('cat composer.json', 'key-1'));
        $this->assertSame(RefusalCode::RunnerUnavailable, $switchedOff->code);

        Schema::drop('module_rule_bundles');
        $broken = $this->refusalOf($this->admit('cat composer.json', 'key-2'));

        $this->assertSame(RefusalCode::ClassificationUnavailable, $broken->code);
        $this->assertSame(0, ProcessRun::query()->withoutGlobalScopes()->count());
    }

    public function test_a_secret_in_an_assignment_never_shows_in_the_refusal(): void
    {
        $refusal = $this->refusalOf($this->admit('TOKEN=hunter2 acme verify', 'key-1'));

        $this->assertStringNotContainsString('hunter2', $refusal->excerpt);
        $this->assertSame('Nothing in this request started.', AdmissionRefusal::NOTICE);
    }

    private function admit(string $line, string $key): Admission
    {
        $this->app->forgetScopedInstances();
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forAgent($this->launch->agent->id));

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
