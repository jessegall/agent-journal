<?php

declare(strict_types=1);

namespace Domain\Helpers\Tests\Feature;

use App\Events\Hooks\HelperCompletionCertified;
use App\Events\Hooks\HelperStopHeld;
use App\Events\Sessions\SessionStartCancelled;
use App\Models\Agents\Agent;
use App\Support\ActorIdentity;
use App\Support\RecordIdentity;
use App\Values\StopCheckReference;
use Domain\Helpers\Enums\JobStatus;
use Domain\Helpers\Listeners\HoldFailingJob;
use Domain\Helpers\Models\HelperIdentity;
use Domain\Helpers\Models\HelperJob;
use Domain\Helpers\Models\HelperPurpose;
use Domain\Helpers\Tests\TestCase;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Support\Str;
use Tests\Support\RefreshHookDatabase;

/**
 * A helper job ends only on what Core says about its helper's stop: a certified stop finishes it with the
 * evidence, a held stop holds it for repair (heard by the job's listener alone; Core also opens a stuck ask), a
 * cancelled start cancels it, and a job that already ended or other work is left alone.
 */
final class HelperJobEndingTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_a_certified_stop_finishes_the_job_with_its_evidence(): void
    {
        $job = $this->job();

        $this->raise(new HelperCompletionCertified($job->assignmentIdentity(), new StopCheckReference('attempt-1')));

        $finished = HelperJob::query()->acrossActors()->findOrFail($job->id);
        $this->assertSame(JobStatus::Finished, $finished->status);
        $this->assertSame('stop-attempt:attempt-1', $finished->stop_evidence_reference);
        $this->assertNotNull($finished->finished_at);
    }

    public function test_a_held_stop_holds_the_job_and_a_cancelled_start_cancels_it(): void
    {
        $held = $this->job();
        $cancelled = $this->job();

        $this->actAsUser('another');

        $this->app->make(HoldFailingJob::class)->handle(
            new HelperStopHeld($held->assignmentIdentity(), new StopCheckReference('attempt-2')),
        );

        $this->raise(new SessionStartCancelled($cancelled->assignmentIdentity()));

        $this->assertSame(JobStatus::Held, HelperJob::query()->acrossActors()->findOrFail($held->id)->status);
        $this->assertSame(JobStatus::Cancelled, HelperJob::query()->acrossActors()->findOrFail($cancelled->id)->status);
    }

    public function test_an_ended_job_and_other_work_are_left_alone(): void
    {
        $job = $this->job();
        $job->cancel();

        $this->raise(new HelperCompletionCertified($job->assignmentIdentity(), new StopCheckReference('attempt-3')));
        $this->raise(new SessionStartCancelled(new RecordIdentity('tasks.task', $job->id)));

        $this->assertSame(JobStatus::Cancelled, HelperJob::query()->acrossActors()->findOrFail($job->id)->status);
    }

    private function job(): HelperJob
    {
        $parent = $this->actAsUser('parent');

        $helper = HelperIdentity::create(
            $parent,
            ActorIdentity::of(Agent::create('Helper '.Str::random(6), 'writing-helper', $this->localProject())),
            'writing-helper',
            'writing-helper',
        );

        $purpose = HelperPurpose::findFree($parent, 'writing-helper', 'General work '.Str::random(6));

        return HelperJob::create(
            $helper,
            $purpose,
            $parent,
            'Fix the test',
            [],
            self::sessionStartFor((string) Str::ulid()),
        );
    }

    private function raise(object $event): void
    {
        $this->actAsUser('another');
        $this->app->make(Dispatcher::class)->dispatch($event);
    }
}
