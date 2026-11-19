<?php

declare(strict_types=1);

namespace App\Actors\Contracts;

/**
 * An actor whose work and messages go to the desk it is seated at, while it holds a seat there.
 */
interface ForwardsToDesk extends Actor {}
