<?php

declare(strict_types=1);

namespace App\Sessions\Contracts;

/**
 * A process start ended for good, however it ended: stopped, called off before it started, or refused by its host.
 */
interface StartEndEvent extends SessionProcessEvent {}
