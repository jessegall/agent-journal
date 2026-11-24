<?php

declare(strict_types=1);

namespace App\Events\Asks;

/**
 * An ask got an answer after it had closed.
 */
final readonly class AskAnsweredLate extends AskEvent
{
    public function __construct(public string $askId) {}
}
