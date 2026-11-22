<?php

declare(strict_types=1);

namespace App\Exceptions;

/**
 * A signed call that did not give its answer: the journal was not reached, the deadline passed, the answer could not
 * be read, or the journal refused it.
 */
abstract class CallFailed extends CommandStopped {}
