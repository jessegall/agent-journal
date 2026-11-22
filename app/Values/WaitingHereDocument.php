<?php

declare(strict_types=1);

namespace App\Values;

/**
 * A here-document whose body the lexer reads after the line that names it: the token index of its redirect, and
 * whether its body strips leading tabs (<<-).
 */
final readonly class WaitingHereDocument
{
    public function __construct(public int $redirect, public bool $stripsTabs) {}
}
