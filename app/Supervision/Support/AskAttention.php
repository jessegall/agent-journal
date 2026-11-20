<?php

declare(strict_types=1);

namespace App\Supervision\Support;

use App\Actors\Contracts\ActorAttention;
use App\Actors\Support\ActorIdentity;
use App\Actors\Support\AttentionOrigin;
use App\Hooks\Contracts\ActorWorkStacks;
use App\Hooks\Contracts\StackTransactionRunner;
use App\Supervision\Models\Ask;
use App\Supervision\Models\AskHop;
use App\Supervision\States\AnsweringAskState;

final readonly class AskAttention
{
    private const string CARD = 'card';

    public function __construct(
        private ActorAttention $attention,
        private ActorWorkStacks $stacks,
        private StackTransactionRunner $transactions,
    ) {}

    public function retainHop(AskHop $hop): void
    {
        $holder = $hop->actor();
        $this->offerNext($holder);
        $hop->recordWake($this->wake($holder, AttentionOrigin::ask($hop->ask_id, $hop->version)));
    }

    public function retainReply(Ask $ask, AskHop $hop, string $body): void
    {
        $hop->answer($body, $this->wake($ask->actor(), AttentionOrigin::askReply($ask->id)));
    }

    public function offerNext(ActorIdentity $holder): void
    {
        if (! $holder->type->isAgent()) {
            return;
        }

        $hop = AskHop::nextFor($holder);
        if ($hop !== null) {
            $this->stacks->offerFor($holder, AnsweringAskState::reference($hop));
        }
    }

    public function finishAnswering(ActorIdentity $holder): void
    {
        $this->stacks->pruneCurrent();
        $this->offerNext($holder);
    }

    public function recover(): void
    {
        AskHop::recoverEach(function (AskHop $pending): void {
            $this->transactions->run(fn () => $this->recoverHop($pending->lockDelivery()));
        });
    }

    private function recoverHop(AskHop $hop): void
    {
        $ask = Ask::forAttention($hop->ask_id);
        if ($hop->attention === AskHop::PENDING_DELIVERY) {
            $requester = $ask->actor();
            $hop->recordAttention($this->wake($requester, AttentionOrigin::askReply($ask->id)));
        }

        if (! $ask->open || $ask->version !== $hop->version) {
            return;
        }

        $holder = $hop->actor();
        $this->offerNext($holder);

        if ($hop->wake === AskHop::PENDING_DELIVERY) {
            $hop->recordWake($this->wake($holder, AttentionOrigin::ask($hop->ask_id, $hop->version)));
        }
    }

    private function wake(ActorIdentity $actor, AttentionOrigin $origin): string
    {
        if (! $actor->type->isAgent()) {
            return self::CARD;
        }

        return $this->attention->request($actor, $origin)->requestId ?? AskHop::PENDING_DELIVERY;
    }
}
