<?php

declare(strict_types=1);

namespace App\Stacks\Contracts\Work;

/**
 * A state an agent's stack holds at most one frame of: a second push of its type finds that frame instead of adding one.
 */
interface UniqueState {}
