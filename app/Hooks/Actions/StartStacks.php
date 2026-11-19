<?php

declare(strict_types=1);

namespace App\Hooks\Actions;

use App\Actors\Contracts\ServerClock;
use App\Agents\Support\StackTarget;
use App\Hooks\Decisions\StateReference;
use App\Hooks\Enums\NoSubject;
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
     * Opens the stack with the ready bottom state, or leaves the one a racing start opened first.
     */
    public function open(StackTarget $target): void
    {
        $this->transaction->requireOpen($target);

        AgentStackRow::insertIfMissing($target, new FrameRecords([
            new FrameRecord(
                (string) Str::ulid(),
                new StateReference(ReadyState::TYPE_KEY, NoSubject::None),
                true,
                1,
                $this->clock->now(),
            ),
        ]), $this->types->ticking());

        AgentStackRow::lockAuthorizedFor($target)->frames->checkBottom();
    }

    public function close(StackTarget $target): void
    {
        $this->transaction->requireOpen($target);

        AgentStackRow::lockAuthorizedFor($target)->closeAt(CarbonImmutable::now());
    }
}
