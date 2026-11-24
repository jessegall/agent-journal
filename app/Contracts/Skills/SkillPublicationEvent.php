<?php

declare(strict_types=1);

namespace App\Contracts\Skills;

use App\Contracts\Events\Event;

/**
 * A step of a skill publication: claimed, progressed or moved to another state.
 */
interface SkillPublicationEvent extends Event {}
