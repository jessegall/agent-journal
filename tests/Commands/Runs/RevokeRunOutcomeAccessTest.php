<?php

declare(strict_types=1);

namespace Tests\Commands\Runs;

use App\Commands\Runs\RevokeRunOutcomeAccess\RevokeRunOutcomeAccessCommand;
use App\Commands\Runs\RevokeRunOutcomeAccess\RevokeRunOutcomeAccessHandler;
use App\Contracts\Actors\CurrentActorSetter;
use App\Enums\Runs\RunLogicalResult;
use App\Enums\Runs\RunResultSource;
use App\Events\Processes\RunOutcomeRecorded;
use App\Listeners\NotifyRunOutcome;
use App\Models\Access\User;
use App\Models\Notifications\NotificationReceipt;
use App\Models\Notifications\NotificationScope;
use App\Models\Runs\ProcessRun;
use App\Resolvers\Support\RunOutcomeSummaries;
use App\Support\ActorIdentity;
use App\Support\RunOutcomes;
use App\Values\OwnerAuthority;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TestActors;
use Tests\Support\TestRunAdmissions;
use Tests\TestCase;

/**
 * An entitled user reads only a run's safe summary, and nothing more once the entitlement is revoked.
 */
#[TestsCommand(RevokeRunOutcomeAccessCommand::class)]
final class RevokeRunOutcomeAccessTest extends TestCase
{
    use RefreshHookDatabase;

    private const string FAILED_LABEL = 'Run failed';

    public function test_an_entitled_user_reads_only_the_safe_summary_until_the_entitlement_is_revoked(): void
    {
        $atlas = TestActors::agentIdentity(3);
        $kim = TestActors::userIdentity(4);
        $run = ProcessRun::create($atlas, TestRunAdmissions::of(
            projectKey: (string) config('processes.project_key'),
            outcomeUserId: $kim->id,
        ));
        $this->app->make(RunOutcomes::class)->record($run, RunLogicalResult::Failed, RunResultSource::Signed);
        $this->app->make(NotifyRunOutcome::class)
            ->handle(new RunOutcomeRecorded($run->id, $run->attempt_id, RunLogicalResult::Failed, false));

        $this->actAs($kim);
        $summary = $this->app->make(RunOutcomeSummaries::class)->summaryOf($run->id)->get();

        $this->assertSame(self::FAILED_LABEL, $summary->label);
        $this->assertSame(substr($run->attempt_id, -8), $summary->attemptReference);
        $this->assertTrue($summary->mayOpenFullRun);
        $this->assertSame(2, NotificationReceipt::query()->count());

        $this->actAs($atlas);
        $this->app->make(RevokeRunOutcomeAccessHandler::class)->handle(
            new RevokeRunOutcomeAccessCommand($run->id)->withDispatcher(ActorIdentity::forAgent($atlas->id)),
        );

        $this->assertFalse($run->refresh()->hasOutcomeFor($kim));
        $this->assertSame(
            0,
            NotificationScope::query()->where('recipient_id', $kim->id)->sole()->unread_count,
        );
    }

    private function actAs(ActorIdentity $actor): void
    {
        $this->app->forgetScopedInstances();
        $context = $actor->type === User::storedType()
            ? ActorIdentity::forUser($actor->id)
            : ActorIdentity::forAgent($actor->id);
        $this->app->make(CurrentActorSetter::class)->set($context, new OwnerAuthority('test'));
    }
}
