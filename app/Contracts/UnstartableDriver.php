<?php

declare(strict_types=1);

namespace App\Contracts;

use Throwable;

/**
 * A refusal meaning the driver cannot start where it was claimed at all, such as a build whose way of sharing the
 * sign-in is not shown there; a start refused by it ends with the reason rather than waiting to be claimed again.
 */
interface UnstartableDriver extends Throwable {}
