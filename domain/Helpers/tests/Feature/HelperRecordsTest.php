<?php

declare(strict_types=1);

namespace Domain\Helpers\Tests\Feature;

use App\Actors\Support\ActorIdentity;
use App\Agents\Models\Agent;
use App\Records\Support\RecordIdentity;
use Domain\Helpers\Enums\JobState;
use Domain\Helpers\Exceptions\HelperIdentityFixed;
use Domain\Helpers\Exceptions\HelperJobFinished;
use Domain\Helpers\Models\HelperIdentity;
use Domain\Helpers\Models\HelperJob;
use Domain\Helpers\Models\HelperPurpose;
use Domain\Helpers\Tests\TestCase;
use Illuminate\Database\QueryException;
use Illuminate\Support\Str;
use Tests\Support\RefreshHookDatabase;

/**
 * A parent's helper identities, purposes and jobs belong to that parent alone (doc 14 revision 5, section 49;
 * doc 47 section 3): another actor finds none of them, a parent has one purpose per profile and record, an identity
 * keeps its profile, and a finished job takes no further change.
 */
final class HelperRecordsTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_another_actor_finds_none_of_a_parents_helper_records(): void
    {
        $parent = $this->actAsUser('parent');
        [$helper, $purpose] = $this->helperFor($parent);

        HelperJob::create(
            $helper,
            $purpose,
            $parent,
            'Read the plan',
            ['subjects' => ['message:1']],
            self::launchFor('request-1'),
        );

        $this->actAsUser('another');

        $this->assertSame(0, HelperIdentity::query()->count());
        $this->assertSame(0, HelperPurpose::query()->count());
        $this->assertSame(0, HelperJob::query()->count());
    }

    public function test_a_parent_has_one_purpose_per_profile_and_record(): void
    {
        $parent = $this->actAsUser('parent');
        $subject = new RecordIdentity('tasks.task', (string) Str::ulid());
        HelperPurpose::forSubject($parent, 'read-only-helper', $subject, 'Review task 41');

        $this->expectException(QueryException::class);

        HelperPurpose::forSubject($parent, 'read-only-helper', $subject, 'Review task 41 again');
    }

    public function test_an_identity_keeps_its_profile(): void
    {
        $parent = $this->actAsUser('parent');
        [$helper] = $this->helperFor($parent);

        $this->expectException(HelperIdentityFixed::class);

        $helper->profile_base = 'writing-helper';
        $helper->save();
    }

    public function test_a_finished_job_takes_no_further_change(): void
    {
        $parent = $this->actAsUser('parent');
        [$helper, $purpose] = $this->helperFor($parent);

        $job = HelperJob::create(
            $helper,
            $purpose,
            $parent,
            'Review',
            ['subjects' => []],
            self::launchFor('request-2'),
        );

        $job->addSteering('Look at the tests too');
        $job->finish('report:12');

        $this->assertSame(JobState::Finished, $job->fresh()?->state);
        $this->assertSame(['Look at the tests too'], $job->fresh()?->steering);
        $this->expectException(HelperJobFinished::class);

        $job->cancel();
    }

    /**
     * @return array{HelperIdentity, HelperPurpose}
     */
    private function helperFor(ActorIdentity $parent): array
    {
        return [
            HelperIdentity::create(
                $parent,
                ActorIdentity::of(Agent::create('Helper '.Str::random(6), 'read-only-helper')),
                'read-only-helper',
                'read-only-helper',
            ),
            HelperPurpose::free($parent, 'read-only-helper', 'General review'),
        ];
    }
}
