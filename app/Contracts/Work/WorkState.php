<?php

declare(strict_types=1);

namespace App\Contracts\Work;

/**
 * A unique subject state that is the agent's work on its record: while it is the top live one of its kind, what the
 * agent writes is linked to that record.
 */
interface WorkState extends UniqueSubjectState {}
