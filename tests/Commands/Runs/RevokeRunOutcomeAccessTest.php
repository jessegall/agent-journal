<?php

declare(strict_types=1);

namespace Tests\Commands\Runs;

use App\Events\Processes\RunOutcomeRecorded;
use App\Listeners\NotifyRunOutcome;
use App\Models\Notifications\NotificationReceipt;
use App\Models\Notifications\NotificationScope;
use App\Models\Runs\ProcessRun;
use App\Processes\Commands\RevokeRunOutcomeAccess\RevokeRunOutcomeAccessCommand;
use App\Processes\Enums\RunLogicalResult;
use App\Processes\Enums\RunResultSource;
use App\Processes\Resolvers\Support\RunOutcomeSummaries;
use App\Processes\RunOutcomes;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;
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
        $this->journal->owner('Kim')->agent('Atlas');
        $atlas = $this->journal->actorCalled('Atlas');
        $kim = $this->journal->actorCalled('Kim');
        $run = ProcessRun::create($atlas, TestRunAdmissions::of(outcomeUserId: $kim->id));
        $this->app->make(RunOutcomes::class)->record($run, RunLogicalResult::Failed, RunResultSource::Signed);
        $this->app->make(NotifyRunOutcome::class)
            ->handle(new RunOutcomeRecorded($run->id, $run->attempt_id, RunLogicalResult::Failed, false));

        $summary = $this->app->make(RunOutcomeSummaries::class)->summaryOf($run->id)->get();

        $this->assertSame(self::FAILED_LABEL, $summary->label);
        $this->assertSame(substr($run->attempt_id, -8), $summary->attemptReference);
        $this->assertTrue($summary->mayOpenFullRun);
        $this->assertSame(2, NotificationReceipt::query()->count());

        $this->journal->runAs('Atlas', new RevokeRunOutcomeAccessCommand($run->id));
        $this->journal->actAs('Kim');

        $this->assertFalse($run->refresh()->hasOutcomeFor($kim));
        $this->assertSame(
            0,
            NotificationScope::query()->where('recipient_id', $kim->id)->sole()->unread_count,
        );
    }
}
