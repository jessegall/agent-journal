<?php

declare(strict_types=1);

namespace App\Bus\Contracts;

use Throwable;

/**
 * Marks an exception as a refusal the caller may be shown, such as a rule that is not proposed, as opposed to a
 * failure such as a lost connection or a bug.
 */
interface CommandRefusal extends Throwable
{
    /**
     * The flash key a refused form reads the refusal's stable code from.
     */
    public const string CODE_FLASH_KEY = 'refusal_code';
}
