<?php

declare(strict_types=1);

namespace Tests\Support\Bus;

use App\Bus\Contracts\Command;
use App\Bus\Contracts\CommandBus;
use App\Bus\Contracts\GuardedCommandBus;
use App\Engine\Enums\CommandOriginStatus;
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
