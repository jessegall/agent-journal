<?php

declare(strict_types=1);

namespace App\Core\Assignments\Contracts;

use App\Core\Actors\Contracts\Actor;

/**
 * An actor that can hold responsibility for a record: a user or an agent. A context object is an Actor only; the
 * persisted user or agent is the Assignee.
 */
interface Assignee extends Actor {}
