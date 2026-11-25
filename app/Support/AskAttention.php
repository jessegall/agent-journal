<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Actors\ActorAttention;
use App\Contracts\Work\AgentStack;
use App\Contracts\Work\StackTransactionRunner;
use App\Models\Asks\Ask;
use App\Models\Asks\AskHop;
use App\Support\States\Support\AnswerAskStateReference;
use Closure;

final readonly class AskAttention
{
    private const string CARD = 'card';

    public function __construct(
        private ActorAttention $attention,
        private AgentStack $stacks,
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
        if (! $holder->isAgent()) {
            return;
        }

        $hop = AskHop::nextFor($holder);

        if ($hop !== null) {
            $this->stacks->offerFor($holder, AnswerAskStateReference::forHop($hop));
        }
    }

    public function recover(): void
    {
        $this->recoverEach(function (AskHop $pending): void {
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
        if (! $actor->isAgent()) {
            return self::CARD;
        }

        return $this->attention->request($actor, $origin)->requestId ?? AskHop::PENDING_DELIVERY;
    }

    /**
     * @param  Closure(AskHop): void  $recover
     */
    private function recoverEach(Closure $recover): void
    {
        AskHop::query()->awaitingDeliveryOrCurrent()
            ->readInChunks(50, function ($hops) use ($recover): void {
                foreach ($hops as $hop) {
                    $recover($hop);
                }
            });
    }
}
