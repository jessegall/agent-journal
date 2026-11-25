<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Drivers\NativeTurnRecords as NativeTurnRecordsContract;
use App\Contracts\Work\StackTransactionRunner;
use App\Enums\Drivers\DriverOperation;
use App\Enums\Drivers\RequestProgress;
use App\Exceptions\StaleProcessGeneration;
use App\Models\Agents\AgentRuntime;
use App\Models\Drivers\DriverRequest;
use App\Models\Drivers\DriverTurn;
use Carbon\CarbonImmutable;

/**
 * Checks a hook call's process generation against its runtime, records the native turns its prompts start and
 * acknowledges the wake the call answers.
 * Sessions without a runtime (starts from before the drivers, tests) pass untouched.
 */
final readonly class NativeTurnRecords implements NativeTurnRecordsContract
{
    public function __construct(private StackTransactionRunner $transaction) {}

    /**
     * @throws StaleProcessGeneration
     */
    public function checkGeneration(string $sessionId, int|null $generation): void
    {
        $runtime = AgentRuntime::ofSession($sessionId);

        if ($runtime !== null && $generation !== null && $generation < $runtime->process_generation) {
            throw StaleProcessGeneration::of($generation, $runtime->process_generation);
        }
    }

    /**
     * An authenticated hook of the session is activity after its wake was taken: it acknowledges the watermark the
     * host claimed, and never reads or answers a message.
     */
    public function acknowledgeWake(string $sessionId, CarbonImmutable $activityAt): void
    {
        $runtime = AgentRuntime::ofSession($sessionId);

        if ($runtime === null) {
            return;
        }

        // The hook is answered after this, in a transaction of its own, so the acknowledgement takes one too.
        $this->transaction->run(fn () => DriverRequest::query()
            ->ofAgentRuntime($runtime->id)
            ->withOperation(DriverOperation::Wake)
            ->withAnyProgress([
                RequestProgress::Staged,
                RequestProgress::Applying,
            ])
            ->lockForUpdate()
            ->get()
            ->each(fn (DriverRequest $wake) => $wake->acknowledgeActivityAt($activityAt)));
    }

    /**
     * Records the turn a prompt starts once per (runtime, generation, native prompt id); a repeated hook adds none.
     * The prompt's text is never stored or logged here.
     */
    public function recordPrompt(string $sessionId, int|null $generation, string|null $promptId): void
    {
        $runtime = AgentRuntime::ofSession($sessionId);

        if ($runtime === null || $promptId === null) {
            return;
        }

        $turnGeneration = $generation ?? $runtime->process_generation;

        // Like the wake's acknowledgement, the turn is written before the hook's own transaction, in one of its own, so
        // its facts reach their listeners.
        $this->transaction->run(
            fn () => DriverTurn::create($runtime->id, $turnGeneration, $promptId, CarbonImmutable::now()),
        );
    }
}
