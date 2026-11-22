<?php

declare(strict_types=1);

namespace App\Communication\Support;

use App\Communication\Contracts\MembershipEvidence;

/**
 * A chat membership, proved by the actor's active interval in the chat inbox.
 */
final readonly class ChatIntervalEvidence implements MembershipEvidence
{
    public function __construct(public string $intervalId) {}
}
