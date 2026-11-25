<?php

declare(strict_types=1);

namespace Domain\Helpers\Tests\Fixtures;

use Domain\Helpers\Commands\CancelStartedHelperJob\CancelStartedHelperJobCommand;
use Domain\Helpers\Commands\SteerHelper\SteerHelperCommand;
use Domain\Helpers\Enums\JobStatus;
use Domain\Helpers\Models\HelperJob;
use Domain\Helpers\Tests\TestCase;
use Tests\Support\RefreshHookDatabase;

/**
 * Helper jobs arranged by name through the journal: two jobs of one parent run on purposes and requests of their own,
 * steering reaches the live job it was sent to, and a helper with no live job keeps the message waiting.
 */
final class HelperFixturesTest extends TestCase
{
    use RefreshHookDatabase;

    private HelperFixtures $helpers;

    protected function setUp(): void
    {
        parent::setUp();

        $this->helpers = $this->journal->owner()->fixtures(HelperFixtures::class)
            ->openJob('Review', 'Owner', 'Review the change')
            ->openJob('Trace', 'Owner', 'Trace the fault');
    }

    public function test_two_jobs_of_one_parent_have_purposes_and_requests_of_their_own(): void
    {
        $this->helpers->assertJob('Review', parent: 'Owner', brief: 'Review the change')
            ->assertJob('Trace', parent: 'Owner', brief: 'Trace the fault');

        [$review, $trace] = [
            $this->helpers->jobCalled('Review'),
            $this->helpers->jobCalled('Trace'),
        ];
        $this->assertNotSame($review->helper_purpose_id, $trace->helper_purpose_id);
        $this->assertNotSame($review->request_id, $trace->request_id);
    }

    public function test_a_job_receipt_names_the_job_and_its_identity(): void
    {
        $receipt = $this->helpers->receiptOf('Review');

        $this->assertSame(
            [
                $this->helpers->jobCalled('Review')->id,
                $this->helpers->identityOf('Review')->id,
                false,
            ],
            [
                $receipt->jobId,
                $receipt->identityId,
                $receipt->isNewJob,
            ],
        );
    }

    public function test_steering_reaches_the_job_it_was_sent_to(): void
    {
        $identity = $this->helpers->identityOf('Trace')->id;

        $this->journal->asOwner(new SteerHelperCommand($identity, 'Look at the hook first.'));

        $this->helpers->assertSteering('Trace', ['Look at the hook first.'])->assertSteering('Review', []);
    }

    public function test_a_helper_with_no_live_job_keeps_the_message_waiting(): void
    {
        $this->helpers->jobCalled('Trace')->cancel();

        $this->journal->asOwner(new SteerHelperCommand($this->helpers->identityOf('Trace')->id, 'Start over.'));

        $this->helpers->assertPendingSteering(
            'Trace',
            sender: 'Owner',
            text: 'Start over.',
        )->assertSteering('Trace', []);
    }

    public function test_a_lifecycle_command_runs_as_the_journal_through_the_helper_lifecycle_entry(): void
    {
        $job = $this->helpers->jobCalled('Trace');

        $this->helpers->runLifecycle(new CancelStartedHelperJobCommand($job->id));

        $this->assertSame(JobStatus::Cancelled, HelperJob::query()->acrossActors()->findOrFail($job->id)->status);
        $this->helpers->assertJob('Review', parent: 'Owner', brief: 'Review the change');
    }
}
