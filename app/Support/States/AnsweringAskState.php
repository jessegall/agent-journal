<?php

declare(strict_types=1);

namespace App\Support\States;

use App\Attributes\StateType;
use App\Commands\OfferNextAsk\OfferNextAskCommand;
use App\Enums\FrameReuse;
use App\Enums\SessionTransferType;
use App\Events\AskClosed;
use App\Events\AskHopAssigned;
use App\Support\Decisions\Decision;
use App\Support\States\Support\AnsweringAskStateReference;
use App\Values\AgentText;
use PhpOption\Option;
use PhpOption\Some;

/**
 * An agent that holds an ask's hop and has to answer it. The hop stays open until the state hears the ask closed or
 * handed on to another hop.
 */
#[StateType(AnsweringAskStateReference::TYPE_KEY, schemaVersion: 1, transfer: SessionTransferType::Durable)]
final class AnsweringAskState extends AgentState
{
    private bool $isOpen = true;

    public function __construct(
        private readonly string $askId,
        private readonly string $hopId
    ) {}

    public function frameReuse(): FrameReuse
    {
        return FrameReuse::PerSubject;
    }

    public function isFinished(): bool
    {
        return ! $this->isOpen;
    }

    /**
     * @return Option<AgentText>
     */
    public function instruction(): Option
    {
        return new Some(AgentText::of('core.asks.waiting'));
    }

    // ----------[ Events ]----------

    /**
     * Its ask closed: the frame settles and the holder is offered the next ask that waits for it.
     */
    public function onAskClosed(AskClosed $event): OfferNextAskCommand|Decision
    {
        if ($event->askId !== $this->askId) {
            return Decision::delegate();
        }

        $this->isOpen = false;

        return new OfferNextAskCommand($this->hopId);
    }

    /**
     * A new hop of the same ask hands it on: this hop is no longer the one to answer.
     */
    public function onAskHopAssigned(AskHopAssigned $event): void
    {
        if ($event->askId === $this->askId && $event->hopId !== $this->hopId) {
            $this->isOpen = false;
        }
    }
}
