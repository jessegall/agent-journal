<?php

declare(strict_types=1);

namespace Domain\Helpers\Tests\Feature;

use App\Contracts\Drivers\DriverCatalogue;
use App\Enums\LaunchCandidateRank;
use App\Models\Agents\Agent;
use App\Models\Drivers\ConversationVisit;
use App\Models\Drivers\DriverConversation;
use App\Support\ActorIdentity;
use App\Support\DefaultDrivers;
use App\Support\RecordIdentity;
use App\Support\StartSessions;
use App\Values\ModelSelection;
use App\Values\SelectedDriver;
use Carbon\CarbonImmutable;
use Domain\Helpers\Models\HelperIdentity;
use Domain\Helpers\Models\HelperJob;
use Domain\Helpers\Models\HelperPurpose;
use Domain\Helpers\Support\Readers\CandidateQuery;
use Domain\Helpers\Support\Readers\HelperCandidate;
use Domain\Helpers\Support\Readers\HelperCandidates;
use Domain\Helpers\Tests\TestCase;
use Illuminate\Support\Str;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TimeLimits\TimeLimit;

/**
 * Which of a parent's helpers takes new work: a conversation on the chosen program
 * and exact model beats a newer one elsewhere, ties go to the lower actor id, independent work skips every helper
 * that saw the subject, and a profile never reuses a helper of another one.
 */
#[TimeLimit(seconds: 3, reason: 'It starts agent sessions and keeps conversations for several helpers.')]
final class HelperSelectionTest extends TestCase
{
    use RefreshHookDatabase;

    private const string LUNA = 'gpt-6-luna';

    private ActorIdentity $parent;

    private HelperPurpose $review;

    protected function setUp(): void
    {
        parent::setUp();

        $this->parent = $this->actAsUser('parent');

        $this->review = HelperPurpose::forSubjectOnce(
            $this->parent,
            'read-only-helper',
            new RecordIdentity('plans.plan', (string) Str::ulid()),
        );
    }

    public function test_a_codex_follow_up_picks_the_codex_reviewer_even_when_the_other_finished_later(): void
    {
        $codex = $this->helperWhoReviewed(
            DefaultDrivers::CODEX,
            self::LUNA,
            CarbonImmutable::parse('2026-11-19 10:00'),
        );

        $claude = $this->helperWhoReviewed(
            DefaultDrivers::CLAUDE_CODE,
            TestSelections::MODEL,
            CarbonImmutable::parse('2026-11-19 12:00'),
        );

        $candidates = $this->candidates(DefaultDrivers::CODEX, self::LUNA);

        $this->assertSame([
            $codex->id,
            $claude->id,
        ], $this->identityIds($candidates));
        $this->assertSame(LaunchCandidateRank::ExactConversation, $candidates[0]->rank);
        $this->assertTrue($candidates[0]->resumesConversation);
        $this->assertSame(LaunchCandidateRank::SamePurpose, $candidates[1]->rank);
    }

    public function test_equal_finishes_pick_the_lower_actor_id(): void
    {
        $finish = CarbonImmutable::parse('2026-11-19 10:00');
        $helpers = [$this->helperWithJob($finish), $this->helperWithJob($finish)];
        usort($helpers, fn (HelperIdentity $a, HelperIdentity $b) => $a->helper_actor_id <=> $b->helper_actor_id);

        $candidates = $this->candidates(DefaultDrivers::CODEX, self::LUNA);

        $this->assertSame([
            $helpers[0]->id,
            $helpers[1]->id,
        ], $this->identityIds($candidates));
    }

    public function test_an_independent_review_skips_every_helper_that_saw_the_subject(): void
    {
        $this->helperWhoReviewed(DefaultDrivers::CODEX, self::LUNA, CarbonImmutable::parse('2026-11-19 10:00'));

        $this->helperWhoReviewed(
            DefaultDrivers::CLAUDE_CODE,
            TestSelections::MODEL,
            CarbonImmutable::parse('2026-11-19 12:00'),
        );

        $fresh = $this->declareHelper('read-only-helper');

        $candidates = $this->candidates(DefaultDrivers::CODEX, self::LUNA, isIndependent: true);

        $this->assertSame([$fresh->id], $this->identityIds($candidates));
        $this->assertFalse($candidates[0]->resumesConversation);
        $this->assertTrue($candidates[0]->isExposureChecked);
    }

    public function test_a_writing_profile_never_picks_a_read_only_identity(): void
    {
        $this->helperWithJob(CarbonImmutable::parse('2026-11-19 10:00'));

        $candidates = $this->app->make(HelperCandidates::class)->candidatesFor(new CandidateQuery(
            'writing-helper',
            'writing-helper',
            $this->review,
            DefaultDrivers::CODEX,
            self::LUNA,
            false,
        ));

        $this->assertSame([], $candidates);
    }

    public function test_a_helper_with_open_work_is_not_offered(): void
    {
        $busy = $this->declareHelper('read-only-helper');

        HelperJob::create(
            $busy,
            $this->review,
            $this->parent,
            'Review',
            ['subjects' => []],
            self::launchFor('request-busy'),
        );

        $this->assertSame([], $this->candidates(DefaultDrivers::CODEX, self::LUNA));
    }

    /**
     * @return list<HelperCandidate>
     */
    private function candidates(string $driver, string $model, bool $isIndependent = false): array
    {
        return $this->app->make(HelperCandidates::class)->candidatesFor(new CandidateQuery(
            'read-only-helper',
            'read-only-helper',
            $this->review,
            $driver,
            $model,
            $isIndependent,
        ));
    }

    /**
     * A helper that finished a review of the plan in a conversation on the program and model.
     */
    private function helperWhoReviewed(
        string $driver,
        string $model,
        CarbonImmutable $finishedAt,
    ): HelperIdentity {
        $identity = $this->helperWithJob($finishedAt);
        $agent = Agent::query()->findOrFail($identity->helper_actor_id);

        $session = $this->app->make(StartSessions::class)->start(
            $agent,
            SelectedDriver::resolve(
                $driver,
                ModelSelection::named($model),
                null,
                null,
                $this->app->make(DriverCatalogue::class),
            ),
            TestSelections::requestId(),
        )->session;

        $conversation = DriverConversation::create($session, 'settings', (string) Str::uuid(), $this->review->id);
        ConversationVisit::create($session, $conversation, 'event-1', $finishedAt);
        $session->endAt($finishedAt);

        return $identity;
    }

    private function helperWithJob(CarbonImmutable $finishedAt): HelperIdentity
    {
        $identity = $this->declareHelper('read-only-helper');

        $job = HelperJob::create(
            $identity,
            $this->review,
            $this->parent,
            'Review',
            ['subjects' => []],
            self::launchFor((string) Str::ulid()),
        );

        $this->travelTo($finishedAt);
        $job->finish('report:1');
        $this->travelBack();

        return $identity;
    }

    private function declareHelper(string $profileKey): HelperIdentity
    {
        $agent = Agent::create('Helper '.Str::random(6), $profileKey);

        return HelperIdentity::create($this->parent, ActorIdentity::of($agent), $profileKey, $profileKey);
    }

    /**
     * @param  list<HelperCandidate>  $candidates
     * @return list<string>
     */
    private function identityIds(array $candidates): array
    {
        return array_map(fn (HelperCandidate $candidate) => $candidate->identity->id, $candidates);
    }
}
