<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks\Stacks;

use App\Stacks\AgentState;
use App\Stacks\Contracts\Work\UniqueState;

/**
 * A test state of which the stack keeps one frame, whatever subject it is pushed for.
 */
final class SingleState extends AgentState implements UniqueState {}
