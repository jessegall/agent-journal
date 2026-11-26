<?php

declare(strict_types=1);

namespace App\Bus\Contracts;

use App\Bus\Values\ReceiptAnswer;

/**
 * The current caller's own receipts, read by what a domain knows of its write: the command, the request key and the
 * target it named. Another caller's receipt and one for another target are never answered.
 */
interface CallerReceipts
{
    /**
     * The receipt of the command under the key for that target, none or one.
     *
     * @param  class-string  $command
     * @return list<ReceiptAnswer>
     */
    public function answerFor(string $command, string $requestKey, string $target): array;
}
