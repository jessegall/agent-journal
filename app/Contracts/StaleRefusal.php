<?php

declare(strict_types=1);

namespace App\Contracts;

/**
 * A refusal because what the caller saw is out of date, such as the session it wrote to or the version of a message;
 * the caller reads again before it tries again. Its code names what went stale.
 */
interface StaleRefusal extends CommandRefusal
{
    public function staleCode(): string;
}
