<?php

declare(strict_types=1);

namespace Domain\Helpers\Tests\Feature\States;

use App\Contracts\Events\Event;
use Domain\Helpers\Events\HelperJobCancelled;
use Domain\Helpers\Events\HelperJobFinished;
use Domain\Helpers\Events\HelperJobHeld;
use Domain\Helpers\Events\HelperJobSteered;
use Domain\Helpers\Models\HelperIdentity;
use Domain\Helpers\Models\HelperJob;
use Domain\Helpers\Support\States\Support\HelperJobStateReference;
use Domain\Helpers\Tests\TestCase;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\Support\CommitsHookRows;
use Tests\Support\Seeding\StateHandle;
use Tests\Support\Seeding\StateObservation;

/**
 * The helper job state on the real engine: steering for its job joins what it shows the helper, and its job held,
 * finished or cancelled ends it, while another job's events leave it as it was.
 */
final class HelperJobStateTest extends TestCase
{
    use CommitsHookRows;

    private const string JOB = 'job-1';

    /**
     * Facts reach a stack once its change commits, so these tests commit and empty what they wrote.
     */
    private const array TABLES = [
        'agent_stacks',
        'command_receipts',
    ];

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner()->agent('Writer');
    }

    public function test_steering_for_its_job_joins_and_another_jobs_does_not(): void
    {
        $this->working()->given(
            [
                new HelperJobSteered('job-2', 'Look at the cache too.'),
                new HelperJobSteered(self::JOB, 'Read the routes first.'),
            ],
            fn (StateObservation $state) => $state->assertValue('steering', ['Read the routes first.']),
        );
    }

    /**
     * @return iterable<string, array{Event, Event}>
     */
    public static function endings(): iterable
    {
        yield 'held' => [
            new HelperJobHeld('job-2'),
            new HelperJobHeld(self::JOB),
        ];

        yield 'finished' => [
            new HelperJobFinished('job-2', 'report 1'),
            new HelperJobFinished(self::JOB, 'report 1'),
        ];

        yield 'cancelled' => [
            new HelperJobCancelled('job-2'),
            new HelperJobCancelled(self::JOB),
        ];
    }

    #[DataProvider('endings')]
    public function test_its_job_ending_ends_it_and_another_jobs_does_not(Event $other, Event $own): void
    {
        $this->working()
            ->given($other, fn (StateObservation $state) => $state->assertLive())
            ->given($own, fn (StateObservation $state) => $state->assertFinished());
    }

    /**
     * A job of a debugging helper, held in memory only: the state keeps what it needs of it in its own values.
     */
    private function working(): StateHandle
    {
        $job = new HelperJob();
        $job->id = self::JOB;
        $job->profile_revision = 1;
        $job->brief = 'Trace the slow page.';
        $job->steering = [];
        $job->source_subjects = [];
        $identity = new HelperIdentity();
        $identity->id = 'helper-1';
        $identity->profile_key = 'journal-debugger';

        return $this->journal->pushState(
            $this->journal->sessionOf('Writer'),
            HelperJobStateReference::forJob($job, $identity, 'Debugging'),
        );
    }
}
