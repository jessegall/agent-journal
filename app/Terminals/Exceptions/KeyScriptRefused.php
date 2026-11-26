<?php

declare(strict_types=1);

namespace App\Terminals\Exceptions;

use App\Bus\Contracts\CommandRefusal;
use RuntimeException;

/**
 * A key script request refused before it is accepted: a name nobody registered, or parameters that do not fit.
 */
final class KeyScriptRefused extends RuntimeException implements CommandRefusal
{
    public static function unknown(string $script): self
    {
        return new self("no key script named {$script} is registered");
    }

    /**
     * @param  list<string>  $problems
     */
    public static function parameters(string $script, array $problems): self
    {
        return new self("the parameters of {$script} do not fit: ".implode('; ', $problems));
    }
}
