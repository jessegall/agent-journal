<?php

declare(strict_types=1);

namespace App\Communication\Exceptions;

use App\Contracts\CommandRefusal;
use RuntimeException;

final class MessageRoundStale extends RuntimeException implements CommandRefusal
{
    public static function for(int $number, int $round, int $current): self
    {
        return new self("Message {$number} is in answer round {$current}, not round {$round}; read it again for its current round.");
    }
}
