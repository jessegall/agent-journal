<?php

declare(strict_types=1);

namespace App\Engine\Commands\SettleFrameTimes;

use App\Contracts\CommandHandler;
use App\Engine\Models\EngineFrameTime;
use App\Engine\Support\EngineAccess;
use App\Engine\Values\FrameSettlement;
use Illuminate\Support\Str;

/**
 * Checks the engine may address every settled frame's stack, then writes all their checkpoints in one statement,
 * without a stack lock.
 */
final readonly class SettleFrameTimesHandler implements CommandHandler
{
    public function __construct(private EngineAccess $access) {}

    public function handle(SettleFrameTimesCommand $command): void
    {
        if ($command->settlements === []) {
            return;
        }

        foreach ($command->settlements as $settlement) {
            $this->access->assertTargetOrMaintenanceGranted($settlement->target, SettleFrameTimesCommand::MAINTENANCE_SCOPE);
        }

        $this->recordMany($command->settlements);
    }

    /**
     * Writes every settlement in one statement, moving a frame's existing checkpoint to its new time. The time is bound
     * as its microsecond text, since an upsert skips the casts and a bound date keeps only whole seconds.
     *
     * @param  list<FrameSettlement>  $settlements
     */
    private function recordMany(array $settlements): void
    {
        EngineFrameTime::query()->upsert(
            array_map(fn (FrameSettlement $settlement) => [
                'id' => (string) Str::ulid(),
                'frame_id' => $settlement->frameId,
                'stack_id' => $settlement->stackId,
                'settled_at' => $settlement->settledAt,
            ], $settlements),
            ['frame_id'],
            ['stack_id', 'settled_at'],
        );
    }
}
