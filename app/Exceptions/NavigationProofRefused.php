<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Contracts\Bus\CommandRefusal;
use RuntimeException;

/**
 * A proof the main agent named that proves nothing: empty, too long, or already on the screen when the request was
 * raised.
 */
final class NavigationProofRefused extends RuntimeException implements CommandRefusal
{
    public static function empty(int $most): self
    {
        return new self("A proof is text of 1 to {$most} characters that shows on the screen once the goal is "
            .'reached.');
    }

    public static function alreadyOnScreen(string $proof): self
    {
        return new self("The proof \"{$proof}\" was already on the screen when the request was raised; it proves "
            .'nothing.');
    }
}
