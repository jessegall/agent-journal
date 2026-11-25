<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Work\StackTransactionRunner;
use App\Enums\RequestOutcome;
use App\Models\Drivers\DriverRequest;
use App\Models\Starts\StartRecord;
use Carbon\CarbonImmutable;

/**
 * Ends each Check status no host answered within its minute as unavailable and leaves its start uncertain, its
 * messages still held, so the owner can ask again.
 */
final readonly class ReadinessCheckSweep
{
    public const int ANSWER_SECONDS_LIMIT = 60;

    private const int PASS_LIMIT = 100;

    public function __construct(private StackTransactionRunner $transaction) {}

    public function sweep(CarbonImmutable $at): void
    {
        $this->transaction->run(fn () => DriverRequest::query()
            ->with('runtime')
            ->unansweredReadinessChecksSince($at->subSeconds(self::ANSWER_SECONDS_LIMIT))
            ->byCreatedAt()
            ->limit(self::PASS_LIMIT)
            ->lockForUpdate()
            ->get()
            ->each(function (DriverRequest $request): void {
                $request->markUnavailable(RequestOutcome::Unconfirmed);

                StartRecord::lockedLatestOf($request->runtime->agent_session_id)->forAll(
                    fn (StartRecord $start) => $start->markReadinessUnseen(),
                );
            }));
    }
}
