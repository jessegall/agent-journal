<?php

declare(strict_types=1);

namespace App\Support\States;

use App\Attributes\States\StateType;
use App\Commands\Asks\OfferNextAsk\OfferNextAskCommand;
use App\Contracts\Events\Event;
use App\Contracts\Work\DurableState;
use App\Contracts\Work\UniqueSubjectState;
use App\Events\Asks\AskClosed;
use App\Events\Asks\AskEvent;
use App\Events\Asks\AskHopAssigned;
use App\Models\Asks\AskHop;
use App\Support\RecordIdentity;
use App\Support\States\Support\AnswerAskStateReference;
use App\Values\AgentText;
use PhpOption\Option;
use PhpOption\Some;

/**
 * An agent that holds an ask's hop and has to answer it. The hop stays open until the state hears the ask closed or
 * handed on to another hop.
 */
#[StateType(AnswerAskStateReference::TYPE_KEY, schemaVersion: 1)]
final class AnswerAskState extends AgentState implements DurableState, UniqueSubjectState
{
    private bool $isOpen = true;

    public function __construct(
        private readonly string $askId,
        private readonly string $hopId
    ) {}

    public function stateSubject(): RecordIdentity
    {
        return new RecordIdentity(AskHop::linkType(), $this->hopId);
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

    public function listensTo(Event $event): bool
    {
        return ! $event instanceof AskEvent || $event->askId === $this->askId;
    }

    // ----------[ Events ]----------

    /**
     * Its ask closed: the frame settles and the holder is offered the next ask that waits for it.
     */
    public function onAskClosed(AskClosed $event): OfferNextAskCommand
    {
        $this->isOpen = false;

        return new OfferNextAskCommand($this->hopId);
    }

    /**
     * A new hop of the same ask hands it on: this hop is no longer the one to answer.
     */
    public function onAskHopAssigned(AskHopAssigned $event): void
    {
        if ($event->hopId !== $this->hopId) {
            $this->isOpen = false;
        }
    }
}
