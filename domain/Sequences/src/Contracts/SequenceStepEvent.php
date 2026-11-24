<?php

declare(strict_types=1);

namespace Domain\Sequences\Contracts;

use App\Contracts\Events\Event;

/**
 * A step of a sequence run reached or ended.
 */
interface SequenceStepEvent extends Event {}
