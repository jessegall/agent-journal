<?php

declare(strict_types=1);

namespace App\Profiles\Exceptions;

use LogicException;

final class AgentProfileMissing extends LogicException
{
    public static function forAuthority(string $authority): self
    {
        return new self("An agent acts under {$authority}, not under the profile its start was pinned to.");
    }
}
