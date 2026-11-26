<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks\Lifecycle;

use App\Stacks\AgentState;

/**
 * A note being read: a state with no values and no answers of its own, registered by a module's listener.
 */
final class ReadNoteState extends AgentState {}
