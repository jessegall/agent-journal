<?php

declare(strict_types=1);

namespace App\Support;

use App\Data\Notifications\NotificationTarget;
use App\Enums\Notifications\NotificationMutationType;
use App\Enums\Notifications\NotificationSourceType;
use App\Models\Notifications\NotificationChange;
use App\Models\Notifications\NotificationOccurrence;
use App\Models\Notifications\NotificationReceipt;
use App\Models\Notifications\NotificationScope;

/**
 * Records one occurrence and one receipt for each distinct recipient, inside the caller's transaction. A replay of
 * the same occurrence key changes nothing. Scopes are locked in one stable order, so two deliveries never deadlock,
 * and each new receipt appends its change to the scope's log under the same lock.
 */
final readonly class NotificationDelivery
{
    public function __construct(private NotificationScopes $scopes) {}

    /**
     * @param  list<ActorReference>  $recipients
     */
    public function deliver(
        string $occurrenceKey,
        NotificationSourceType $source,
        NotificationTarget $target,
        array $recipients,
    ): void {
        $occurrence = NotificationOccurrence::create($occurrenceKey, $source, $target);

        if (! $occurrence->isNew()) {
            return;
        }

        foreach ($this->inLockOrder($recipients) as [$key, $recipient]) {
            NotificationScope::create($key, $recipient);
            $scope = NotificationScope::findLockedFor($key, $recipient);
            $receipt = NotificationReceipt::create($occurrence, $scope);

            if ($receipt->isNew()) {
                $scope->addReceipt();
                NotificationChange::create($scope, $receipt, NotificationMutationType::Create);
            }
        }
    }

    /**
     * Each distinct recipient with its scope key, ordered by scope key, recipient type and recipient id.
     *
     * @param  list<ActorReference>  $recipients
     * @return list<array{string, ActorReference}>
     */
    private function inLockOrder(array $recipients): array
    {
        $distinct = [];

        foreach ($recipients as $recipient) {
            $key = $this->scopes->keyFor($recipient);

            $distinct["{$key}\0{$recipient->type}\0{$recipient->id}"] = [
                $key,
                $recipient,
            ];
        }

        ksort($distinct, SORT_STRING);

        return array_values($distinct);
    }
}
