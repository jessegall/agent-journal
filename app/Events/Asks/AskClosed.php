<?php

declare(strict_types=1);

namespace App\Events\Asks;

/**
 * An ask closed: answered, settled, withdrawn or closed unanswered. It names the ask and its type only.
 */
final readonly class AskClosed implements AskEvent
{
    public function __construct(
        public string $askId,
        public string $typeKey,
    ) {}
}
