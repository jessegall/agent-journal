<?php

declare(strict_types=1);

namespace App\Contracts;

use Throwable;

/**
 * Marks an exception as a refusal the caller may be shown, such as a rule that is not proposed, as opposed to a
 * failure such as a lost connection or a bug.
 */
interface CommandRefusal extends Throwable {}
