<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Agents\Enums\DriverOperation;
use App\Agents\Values\DriverReceipt;
use App\Agents\Values\DriverRequestPayload;
use App\Agents\Values\StackTarget;

/**
 * Asks an agent's runtime to wake: an open wake is asked again, else a new wake request is appended. It joins the
 * caller's transaction, so a wake asked while sending a message is saved with the message or not at all.
 */
final readonly class AgentWakes
{
    public function __construct(private DriverRequests $requests) {}

    public function wake(StackTarget $target, string $idempotencyKey): DriverReceipt
    {
        $open = $this->requests->openWake($target);

        if ($open !== null) {
            $open->claimWake($open->wake_requested + 1);

            return $open->receipt();
        }

        $wake = $this->requests->append(
            $target,
            DriverOperation::Wake,
            $idempotencyKey,
            DriverRequestPayload::nothing(),
        );
        $wake->claimWake(1);

        return $wake->receipt();
    }
}
