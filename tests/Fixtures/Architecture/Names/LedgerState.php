<?php

declare(strict_types=1);

namespace Tests\Fixtures\Architecture\Names;

/**
 * Where a ledger stands, named State where the rule asks for Status.
 */
enum LedgerState: string
{
    case Open = 'open';
    case Closed = 'closed';
}
