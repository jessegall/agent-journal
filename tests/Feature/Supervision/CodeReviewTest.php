<?php

declare(strict_types=1);

namespace Tests\Feature\Supervision;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorIdentity;
use App\Actors\Values\TrustedEntryAuthority;
use App\Agents\Models\WorkReservation;
use App\Bus\Contracts\CommandBus;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\CommandEntrance;
use App\Bus\Support\RequestKey;
use App\Communication\Models\NotificationReceipt;
use App\Communication\Models\NotificationScope;
use App\Engine\Support\EngineAccess;
use App\Engine\Support\EngineActor;
use App\Profiles\Commands\ActivateProfiles;
use App\Profiles\Support\ProfileProposal;
use App\Records\Support\RecordIdentity;
use App\Supervision\Commands\ApproveCodeReview;
use App\Supervision\Commands\HandOffCodeReview;
use App\Supervision\Commands\ReplyToAsk;
use App\Supervision\Contracts\AskReader;
use App\Supervision\Enums\AskResult;
use App\Supervision\Enums\CodeReviewState;
use App\Supervision\Models\Ask;
use App\Supervision\Models\AskHop;
use App\Supervision\Models\CodeReview;
use App\Supervision\Models\ReviewDecision;
use App\Supervision\Resolvers\MergeAskNotificationTarget;
use Domain\Access\Models\User;
use Domain\Tasks\Models\Task;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\Agents\CertifiesHelperWork;
use Tests\Support\CommitsHookRows;
use Tests\Support\StartsAgentRequests;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * Certified work that must be reviewed reaches its reviewer and, once approved, its merger (task 965): the engine's
 * handoff imports it once and opens one review ask even when no certification event is heard, the reviewer's typed
 * approval opens one merge ask on the merge route of the code-reviewer role, and a reply that says approved decides
 * nothing.
 */
#[TimeLimit(seconds: 8, reason: 'It builds two git repositories, activates the profiles and routes asks.')]
final class CodeReviewTest extends TestCase
{
    use CertifiesHelperWork;
    use CommitsHookRows;
    use StartsAgentRequests;

    private const array TABLES = [
        'active_accounts', 'account_notices', 'accounts', 'process_starts', 'agent_runtimes',
        'review_decisions', 'code_reviews', 'work_reservations', 'certified_works', 'session_policies',
        'start_records', 'ask_hops', 'asks', 'ask_requesters', 'supervisor_changes', 'supervisor_links',
        'assignments', 'command_receipts', 'start_tokens', 'agent_sessions', 'agents', 'profile_revisions', 'profiles',
        'agent_stacks', 'pending_agent_messages', 'driver_requests', 'tasks', 'users',
        'notification_changes',
        'notification_receipts', 'notification_scopes', 'notification_occurrences',
    ];

    private TestStart $worker;

    private TestStart $reviewer;

    private TestStart $merger;

    protected function setUp(): void
    {
        parent::setUp();
        $this->buildHelperRepositories();
        $this->startUserRequestAs(User::factory()->create()->id);
        $this->app->make(CommandBus::class)->run(new ActivateProfiles(ProfileProposal::fromConfiguration(
            (array) config('profiles'),
        )));
        $this->worker = TestStart::start('journal-worker');
        $this->reviewer = TestStart::start('journal-code-reviewer');
        $this->merger = TestStart::start('journal-merger');
        $work = $this->certifyHelperWork($this->worker, 'attempt-1', true, $this->workRecord());
        WorkReservation::retain($work, ActorIdentity::of($this->worker->agent), 1);
    }

    protected function tearDown(): void
    {
        $this->removeHelperRepositories();

        parent::tearDown();
    }

    public function test_a_lost_certification_event_still_gives_one_import_and_one_review_ask(): void
    {
        $this->handOff('pass-1');
        $this->handOff('pass-2');

        $review = CodeReview::query()->sole();
        $this->assertSame(CodeReviewState::Open, $review->state);
        $this->assertSame('profile:journal-code-reviewer', $review->origin_target);
        $this->assertSame($this->git("{$this->folder}/helper", 'rev-parse', 'HEAD'), $review->head);
        $this->assertSame(1, Ask::query()->acrossActors()->where('type_key', 'review.ready')->count());
        $this->assertSame($this->reviewer->agent->id, AskHop::currentFor($this->reviewAsk())->actor_id);
    }

    public function test_an_approval_opens_one_merge_ask_on_the_code_reviewers_merge_route(): void
    {
        $this->handOff('pass-1');
        $ask = $this->reviewAsk();

        $this->reviewer->startRequest($this->app);
        $this->app->make(CommandBus::class)->run(new ApproveCodeReview($ask->reference(), $ask->version, 'Clean.'));

        $decision = ReviewDecision::query()->sole();
        $merge = Ask::query()->acrossActors()->where('type_key', 'merge.ready')->sole();
        $this->assertSame($merge->id, $decision->merge_ask_id);
        $this->assertSame($this->reviewer->agent->id, $merge->actor_id);
        $this->assertSame($this->merger->agent->id, AskHop::currentFor($merge)->actor_id);
        $this->assertFalse($ask->refresh()->open);
    }

    public function test_an_approved_merge_ask_gives_its_merger_one_receipt_and_the_review_ask_none(): void
    {
        $this->handOff('pass-1');
        $ask = $this->reviewAsk();

        $this->reviewer->startRequest($this->app);
        $this->app->make(CommandBus::class)->run(new ApproveCodeReview($ask->reference(), $ask->version, 'Clean.'));

        $merge = Ask::query()->acrossActors()->where('type_key', 'merge.ready')->sole();
        $receipt = NotificationReceipt::query()->with('occurrence')->sole();
        $this->assertSame(MergeAskNotificationTarget::KEY, $receipt->occurrence->target_key);
        $this->assertSame($merge->id, $receipt->occurrence->target_id);
        $this->assertSame(
            $this->merger->agent->id,
            NotificationScope::query()->whereKey($receipt->scope_id)->sole()->recipient_id,
        );
    }

    public function test_the_merge_asks_holder_reads_it_passively_with_its_version_and_approve_action(): void
    {
        $this->handOff('pass-1');
        $ask = $this->reviewAsk();

        $this->reviewer->startRequest($this->app);
        $this->app->make(CommandBus::class)->run(new ApproveCodeReview($ask->reference(), $ask->version, 'Clean.'));
        $merge = Ask::query()->acrossActors()->where('type_key', 'merge.ready')->sole();

        $this->app->forgetScopedInstances();
        $this->merger->startRequest($this->app);
        $detail = $this->app->make(AskReader::class)->detail($merge->reference());
        $link = $this->app->make(MergeAskNotificationTarget::class)->linksFor([$merge->id])[$merge->id];

        $this->assertSame($merge->version, $detail->version);
        $this->assertSame(AskResult::Open, $detail->result);
        $this->assertTrue($detail->canApproveMerge);
        $this->assertSame(ReviewDecision::query()->sole()->id, $detail->mergeDecisionId);
        $this->assertSame("/web/asks/{$merge->id}", $link->url);
        $this->assertTrue($merge->refresh()->open);
    }

    public function test_a_reply_that_says_approved_decides_nothing(): void
    {
        $this->handOff('pass-1');

        $this->reviewer->startRequest($this->app);
        rescue(
            fn () => $this->app->make(CommandBus::class)->run(new ReplyToAsk($this->reviewAsk()->reference(), 'approved')),
        );

        $this->assertSame(0, ReviewDecision::query()->count());
        $this->assertSame(0, Ask::query()->acrossActors()->where('type_key', 'merge.ready')->count());
    }

    /**
     * A task the worker holds, standing for the job it did, as a helper job does in Helpers.
     */
    private function workRecord(): RecordIdentity
    {
        return Task::create('Fix the failing test', 'Make the suite pass.', $this->worker->agent)->assignmentIdentity();
    }

    private function reviewAsk(): Ask
    {
        return Ask::query()->acrossActors()->where('type_key', 'review.ready')->sole();
    }

    /**
     * Runs the review handoff for the reserved work, as one engine pass does.
     */
    private function handOff(string $pass): void
    {
        $this->app->make(CurrentActorSetter::class)->set(new EngineActor(), new TrustedEntryAuthority('engine pass'));
        $this->app->make(EngineAccess::class)->grantMaintenance(HandOffCodeReview::MAINTENANCE_SCOPE);
        $this->app->make(RequestKey::class)->set($pass);
        $bus = $this->app->make(CommandBus::class);
        $this->app->make(CommandEntrance::class)->through(
            CommandEntry::EngineMaintenance,
            fn () => $bus->run(new HandOffCodeReview('attempt-1')),
        );
    }
}
