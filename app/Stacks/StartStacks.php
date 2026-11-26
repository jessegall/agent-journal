<?php

declare(strict_types=1);

namespace App\Stacks;

use App\Models\Agents\AgentStackRow;
use App\Models\Sessions\SessionRequest;
use App\Stacks\Exceptions\StateSchemaUnknown;
use App\Stacks\Exceptions\StateTransferUnknown;
use App\Stacks\Support\ReadyStateReference;
use App\Support\StackTransaction;
use App\Support\Storage\FrameRecord;
use App\Support\Storage\FrameRecords;
use App\Time\Contracts\ServerClock;
use App\Values\StackTarget;
use Carbon\CarbonImmutable;
use Illuminate\Support\Str;

/**
 * Opens and closes the stack of a start. Only a start does this, so it reads the stack through the explicit
 * authorized query instead of the calling agent's own.
 */
final readonly class StartStacks
{
    public function __construct(
        private StackTransaction $transaction,
        private ServerClock $clock,
        private StateTypes $types,
    ) {}

    /**
     * Opens the stack with the ready bottom state, or leaves the one a racing start opened first. A resumed
     * conversation carries the durable frames of its last closed stack above that bottom, in order; only the open whose
     * insert won enters them.
     */
    public function open(StackTarget $target): void
    {
        $this->transaction->assertOpen($target);

        $bottom = new FrameRecord(
            (string) Str::ulid(),
            ReadyStateReference::bottom(),
            true,
            1,
            $this->clock->now(),
        );

        $carried = $this->carriedFrames($target);

        $frames = new FrameRecords([$bottom, ...$carried]);

        AgentStackRow::create($target, $frames, $this->types->ticking());

        AgentStackRow::findLockedAuthorizedFor($target)->frames->checkBottom();
    }

    /**
     * The durable frames a resumed start carries from the agent's last closed stack; a frame whose type is no longer
     * registered or whose stored schema is unknown refuses the start, so no stack opens without its owed work.
     *
     * @return list<FrameRecord>
     *
     * @throws StateTransferUnknown
     * @throws StateSchemaUnknown
     */
    private function carriedFrames(StackTarget $target): array
    {
        if (! SessionRequest::isConversationResumed($target->sessionId)) {
            return [];
        }

        $previous = AgentStackRow::findLastClosedBefore($target)->map(fn (AgentStackRow $row) => $row->frames->all());
        $carriedFrames = [];

        foreach ($previous->getOrElse([]) as $record) {
            if ($record->isBottom) {
                continue;
            }

            if (! $this->types->registry()->has($record->reference->typeKey)) {
                throw StateTransferUnknown::for($record->description());
            }

            $type = $this->types->registry()->get($record->reference->typeKey);

            if ($record->schemaVersion !== $type->schemaVersion) {
                throw StateSchemaUnknown::for($record->description(), $type->schemaVersion);
            }

            if ($type->isDurable()) {
                $carriedFrames[] = $record;
            }
        }

        return $carriedFrames;
    }

    public function close(StackTarget $target): void
    {
        $this->transaction->assertOpen($target);

        AgentStackRow::findLockedAuthorizedFor($target)->closeAt(CarbonImmutable::now());
    }
}
