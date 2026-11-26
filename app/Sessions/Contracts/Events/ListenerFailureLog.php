<?php

declare(strict_types=1);

namespace App\Sessions\Contracts\Events;

/**
 * A fact about work already committed: a listener that fails on it is logged and passed over, so it can neither undo
 * the work nor turn the caller's success into a failure.
 */
interface ListenerFailureLog {}
