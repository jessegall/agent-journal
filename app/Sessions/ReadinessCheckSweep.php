<?php

declare(strict_types=1);

namespace App\Sessions;

use App\Agents\Drivers\Enums\RequestOutcome;
use App\Contracts\Work\StackTransactionRunner;
use App\Models\Drivers\DriverRequest;
use App\Models\Sessions\SessionRequest;
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
            ->withRuntime()
            ->unansweredReadinessChecksSince($at->subSeconds(self::ANSWER_SECONDS_LIMIT))
            ->byCreatedAt()
            ->limit(self::PASS_LIMIT)
            ->lockForUpdate()
            ->get()
            ->each(function (DriverRequest $request): void {
                $request->markUnavailable(RequestOutcome::Unconfirmed);

                SessionRequest::findLockedLatestOf($request->runtime->agent_session_id)->forAll(
                    fn (SessionRequest $start) => $start->markReadinessUnseen(),
                );
            }));
    }
}
