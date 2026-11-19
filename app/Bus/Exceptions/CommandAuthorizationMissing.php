<?php

declare(strict_types=1);

namespace App\Bus\Exceptions;

use LogicException;

/**
 * An application command declares no Authorize: every command a person or an agent sends names the policy and
 * ability that decide it, and only a trusted entry may leave it out.
 */
final class CommandAuthorizationMissing extends LogicException
{
    /**
     * @param  class-string  $command
     */
    public static function for(string $command): self
    {
        return new self(
            "{$command} declares no Authorize: name the policy and ability that decide it, or its trusted entry.",
        );
    }
}
