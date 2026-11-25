<?php

declare(strict_types=1);

namespace App\Events\Skills;

use App\Contracts\Events\Event;

/**
 * A fact about skills and their publication: every event of that subject implements it, so a listener typed on it hears
 * them all.
 */
interface SkillEvent extends Event {}
