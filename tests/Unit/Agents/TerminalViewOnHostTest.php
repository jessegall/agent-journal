<?php

declare(strict_types=1);

namespace Tests\Unit\Agents;

use App\Engine\EngineListenerSet;
use App\Terminals\EndTerminalViewsOnTick;
use Tests\Support\Engine\RunsEnginePasses;
use Tests\Support\OpensTerminalRuntimes;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * The host learns which runtimes are watched through its claim, at once when the list changed, and the engine ends
 * views that lapsed or whose runtime stopped; while the engine does not run, nothing ends.
 */
#[TimeLimit(seconds: 3, reason: 'It commits real rows on the hook database and empties its tables around each test.')]
final class TerminalViewOnHostTest extends TestCase
{
    use OpensTerminalRuntimes;
    use RunsEnginePasses;

    public function test_the_engine_registers_the_view_sweep(): void
    {
        $this->assertTrue($this->app->make(EngineListenerSet::class)->has(EndTerminalViewsOnTick::class));
    }
}
