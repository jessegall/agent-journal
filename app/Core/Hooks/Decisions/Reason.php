<?php

declare(strict_types=1);

namespace App\Core\Hooks\Decisions;

/**
 * The words an agent reads when a state denies a hook or holds its stop; never empty.
 */
final readonly class Reason
{
    public function __construct(public string $text)
    {
        if (trim($text) === '') {
            throw EmptyReason::forDecision();
        }
    }
}
