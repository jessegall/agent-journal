<?php

declare(strict_types=1);

namespace App\Hooks\Drivers;

use App\Hooks\Drivers\Contracts\DriverCall;
use Closure;

/**
 * A native call for a tool that only reads, such as reading a file: the journal has no state that judges it, so the
 * program gets the neutral reply and its own permission handling decides.
 */
final readonly class UnjudgedCall implements DriverCall
{
    public function __construct(private DriverReply $reply) {}

    public function replyWith(Closure $answerByJournal): DriverReply
    {
        return $this->reply;
    }
}
