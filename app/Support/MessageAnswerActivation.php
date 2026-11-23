<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Actors\ActorWorkStacks;
use App\Contracts\Actors\CurrentActor;
use App\Contracts\Work\IncomingWork;
use App\Contracts\Work\StackTransaction;
use App\Models\Messages\Message;
use App\Models\Records\AssignmentRecord;
use App\Support\States\Support\AnsweringMessageStateReference;

/**
 * At the start of each hook, gives the acting actor an answering frame for its oldest message claim that still
 * stands, unless it is already answering one, in a stack transaction of its own before the hook's. One frame at a
 * time: the next is activated once the current finishes.
 */
final readonly class MessageAnswerActivation implements IncomingWork
{
    private const int LARGEST_PASS = 100;

    public function __construct(
        private CurrentActor $actors,
        private ActorWorkStacks $workStacks,
        private ProvedClaims $proved,
        private StackTransaction $transaction,
    ) {}

    public function accept(): void
    {
        if (! $this->actors->hasActor() || $this->isAnswering()) {
            return;
        }

        $actor = AssigneeIdentity::of($this->actors->actor());

        $heldIds = AssignmentRecord::query()
            ->heldRecordIds(Message::LINK_TYPE, $actor)
            ->limit(self::LARGEST_PASS)
            ->pluck('record_id')
            ->all();

        $valid = $this->proved->validClaimsOn(Message::LINK_TYPE, array_values(array_map('strval', $heldIds)));
        $oldest = $valid === [] ? null : $valid[min(array_keys($valid))];

        if ($oldest !== null && $oldest->holder()->isSameAs($actor)) {
            $frame = AnsweringMessageStateReference::forClaim($oldest->reference->id);
            $this->transaction->run(fn () => $this->workStacks->push($frame));
        }
    }

    private function isAnswering(): bool
    {
        return $this->workStacks->current(AnsweringMessageStateReference::TYPE_KEY)->isDefined();
    }
}
