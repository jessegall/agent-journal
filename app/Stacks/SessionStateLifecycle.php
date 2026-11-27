<?php

declare(strict_types=1);

namespace App\Stacks;

use App\Models\Agents\AgentStackRow;
use App\Models\Sessions\SessionRequest;
use App\Stacks\Contracts\BaseStateReference;
use App\Stacks\Exceptions\StateSchemaUnknown;
use App\Stacks\Exceptions\StateTransferUnknown;
use App\Stacks\References\StateReference;
use App\Support\StackTransaction;
use App\Support\Storage\FrameRecord;
use App\Support\Storage\FrameRecords;
use App\Time\Contracts\ServerClock;
use App\Values\StackTarget;
use Carbon\CarbonImmutable;
use Illuminate\Support\Str;

/**
 * The life of a session's states: its stack opens on its base states, the ready state at the bottom, and closes when
 * the session ends. Only a session's start does this, so it reads the stack through the explicit authorized query,
 * not the caller's own.
 */
final readonly class SessionStateLifecycle
{
    /**
     * @param  list<class-string<BaseStateReference>>  $baseStates  bottom first, as config/journal.php lists them
     */
    public function __construct(
        private StackTransaction $transaction,
        private ServerClock $clock,
        private StateTypes $types,
        private array $baseStates,
    ) {}

    /**
     * Opens the stack on its base states, the ready state at the bottom, or leaves the one a racing start opened
     * first. A resumed conversation carries the durable frames of its last closed stack above that base, in
     * order; only the open whose insert won enters them.
     */
    public function open(StackTarget $target): void
    {
        $this->transaction->assertOpen($target);

        $references = array_map(fn (string $reference) => $reference::forSession($target), $this->baseStates);

        $base = array_map(
            fn (StateReference $reference, int $place) => $this->baseFrameOf($reference, $place === 0),
            $references,
            array_keys($references),
        );

        $frames = new FrameRecords([...$base, ...$this->carriedFrames($target)]);

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

    /**
     * The frame of a base state, made fresh for each session, the first one the stack's bottom: a base state is never
     * carried over.
     */
    private function baseFrameOf(StateReference $reference, bool $isBottom): FrameRecord
    {
        return new FrameRecord(
            (string) Str::ulid(),
            $reference,
            $isBottom,
            $this->types->registry()->get($reference->typeKey)->schemaVersion,
            $this->clock->now(),
            $reference->values,
        );
    }
}
