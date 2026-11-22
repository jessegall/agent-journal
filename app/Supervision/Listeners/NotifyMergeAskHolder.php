<?php

declare(strict_types=1);

namespace App\Supervision\Listeners;

use App\Actors\Support\ActorIdentity;
use App\Communication\Contracts\Notifications;
use App\Communication\Data\NotificationTarget;
use App\Communication\Enums\NotificationSourceType;
use App\Contracts\Attributes\InCommandTransaction;
use App\Contracts\Listener;
use App\Supervision\Enums\CoreAskType;
use App\Supervision\Events\AskClosed;
use App\Supervision\Events\AskHopAssigned;
use App\Supervision\Models\AskHop;
use App\Supervision\Resolvers\MergeAskNotificationTarget;

/**
 * Keeps a merge ask's notification with its holder, in the transaction that moved it: a committed hop gives its
 * holder one receipt and takes the previous holder's away; a closed ask leaves its final holder's receipt as read
 * history. Pending routing raises no hop, so it stays silent, and a retried hop meets its own occurrence key.
 */
#[InCommandTransaction]
final readonly class NotifyMergeAskHolder implements Listener
{
    public function __construct(private Notifications $notifications) {}

    public function handle(AskHopAssigned|AskClosed $fact): void
    {
        if ($fact->typeKey !== CoreAskType::MergeReady->value) {
            return;
        }

        $target = new NotificationTarget(MergeAskNotificationTarget::KEY, $fact->askId);

        if ($fact instanceof AskClosed) {
            AskHop::latestHolderOf($fact->askId)->forAll(
                fn (ActorIdentity $holder) => $this->notifications->settle($target, $holder),
            );

            return;
        }

        AskHop::holderBefore($fact->askId, $fact->hopId)->forAll(
            fn (ActorIdentity $previous) => $this->notifications->withdraw($target, $previous),
        );

        $this->notifications->deliver(
            "merge-ask:{$fact->askId}:hop:{$fact->hopId}",
            NotificationSourceType::MergeAsk,
            $target,
            [$fact->holder],
        );
    }
}
