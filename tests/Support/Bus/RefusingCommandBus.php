<?php

declare(strict_types=1);

namespace Tests\Support\Bus;

use App\Contracts\Bus\Command;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Bus\GuardedCommandBus;
use App\Enums\Engine\CommandOriginStatus;
use Closure;
use Tests\Support\Exceptions\BusUsedInUnitTest;

/**
 * The bus of a unit test: it refuses every command, so a unit test proves what it tests without running one.
 */
final readonly class RefusingCommandBus implements CommandBus, GuardedCommandBus
{
    public function __construct(private string $testClass) {}

    public function run(Command $command): mixed
    {
        throw BusUsedInUnitTest::by($this->testClass);
    }

    public function runGuarded(Command $command, Closure $check): CommandOriginStatus
    {
        throw BusUsedInUnitTest::by($this->testClass);
    }
}
