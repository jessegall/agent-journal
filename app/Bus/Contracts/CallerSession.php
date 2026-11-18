<?php

declare(strict_types=1);

namespace App\Bus\Contracts;

/**
 * The agent session whose receipts this request reads and writes: the session of the signed call.
 */
interface CallerSession
{
    public function sessionId(): string;
}
