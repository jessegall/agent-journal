<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Time\ServerClock;
use App\Enums\NoSubject;
use App\Enums\SessionTransferType;
use App\Exceptions\StateSchemaUnknown;
use App\Exceptions\StateTransferUnknown;
use App\Models\Agents\AgentStackRow;
use App\Models\Starts\StartRecord;
use App\Support\References\StateReference;
use App\Support\Stack\StateTypes;
use App\Support\States\ReadyState;
use App\Support\Storage\FrameRecord;
use App\Support\Storage\FrameRecords;
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
     * Opens the stack with the ready bottom state, or leaves the one a racing start opened first. A start that
     * resumes the agent's conversation carries the durable frames of its last closed stack above that bottom, in
     * order; session-only frames stay behind with the old stack, which stays history. Only the open whose insert won
     * enters the carried frames; a racing loser reads the winner's row and settles nothing.
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

        $carried = $this->carriedFrames($target);
        $frames = new FrameRecords([
            $bottom,
            ...$carried,
        ]);
        AgentStackRow::create($target, $frames, $this->types->ticking());

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

            if ($record->schemaVersion !== $type->schemaVersion) {
                throw StateSchemaUnknown::for($record->description(), $type->schemaVersion);
            }

            if ($type->transfer === SessionTransferType::Durable) {
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
