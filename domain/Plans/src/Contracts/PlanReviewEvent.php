<?php

declare(strict_types=1);

namespace Domain\Plans\Contracts;

use App\Contracts\Events\Event;

/**
 * A step of a plan review: requested, decided or withdrawn.
 */
interface PlanReviewEvent extends Event {}
