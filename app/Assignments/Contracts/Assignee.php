<?php

declare(strict_types=1);

namespace App\Assignments\Contracts;

use App\Actors\Contracts\Actor;

/**
 * An actor that can hold responsibility for a record: a user or an agent. A context object is an Actor only; the
 * persisted user or agent is the Assignee.
 */
interface Assignee extends Actor {}
