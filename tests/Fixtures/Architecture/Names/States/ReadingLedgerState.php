<?php

declare(strict_types=1);

namespace Tests\Fixtures\Architecture\Names\States;

use App\Stacks\AgentState;

/**
 * A state named with the gerund, which the names scan refuses: it should be ReadLedgerState.
 */
abstract class ReadingLedgerState extends AgentState {}
