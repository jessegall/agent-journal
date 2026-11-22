<?php

declare(strict_types=1);

namespace App\Contracts;

/**
 * An actor whose work and messages go to the desk it is seated at, while it holds a seat there.
 */
interface SeatedActor extends Actor {}
