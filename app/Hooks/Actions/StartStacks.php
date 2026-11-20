<?php

declare(strict_types=1);

namespace App\Hooks\Actions;

use App\Actors\Contracts\ServerClock;
use App\Agents\Models\StartRecord;
use App\Agents\Support\StackTarget;
use App\Hooks\Decisions\StateReference;
use App\Hooks\Enums\NoSubject;
use App\Hooks\Enums\SessionTransferType;
use App\Hooks\Exceptions\StateSchemaUnknown;
use App\Hooks\Exceptions\StateTransferUnknown;
use App\Hooks\Models\AgentStackRow;
use App\Hooks\Stack\StateTypes;
use App\Hooks\States\ReadyState;
use App\Hooks\Storage\FrameRecord;
use App\Hooks\Storage\FrameRecords;
use App\Hooks\Support\StackTransaction;
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
     * Opens the stack with the ready bottom state, or leaves the one a racing start opened first. A start that
     * resumes the agent's conversation carries the durable frames of its last closed stack above that bottom, in
     * order; session-only frames stay behind with the old stack, which stays history.
     */
    public function open(StackTarget $target): void
    {
        $this->transaction->assertOpen($target);
        $bottom = new FrameRecord(
            (string) Str::ulid(),
            new StateReference(ReadyState::TYPE_KEY, NoSubject::None),
            true,
            1,
            $this->clock->now(),
        );

        AgentStackRow::insertIfMissing(
            $target,
            new FrameRecords([$bottom, ...$this->carriedFrames($target)]),
            $this->types->ticking(),
        );

        AgentStackRow::lockAuthorizedFor($target)->frames->checkBottom();
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
        if (! StartRecord::resumesConversation($target->sessionId)) {
            return [];
        }

        $previous = AgentStackRow::lastClosedBefore($target)->map(fn (AgentStackRow $row) => $row->frames->all());
        $carriedFrames = [];

        foreach ($previous->getOrElse([]) as $record) {
            if ($record->isBottom) {
                continue;
            }

            if (! $this->types->registry()->has($record->reference->typeKey)) {
                throw StateTransferUnknown::for($record->description());
            }

            $type = $this->types->registry()->get($record->reference->typeKey);

            if ($record->schemaVersion !== $type->schemaVersion()) {
                throw StateSchemaUnknown::for($record->description(), $type->schemaVersion());
            }

            if ($type->sessionTransfer() === SessionTransferType::Durable) {
                $carriedFrames[] = $record;
            }
        }

        return $carriedFrames;
    }

    public function close(StackTarget $target): void
    {
        $this->transaction->assertOpen($target);

        AgentStackRow::lockAuthorizedFor($target)->closeAt(CarbonImmutable::now());
    }
}
