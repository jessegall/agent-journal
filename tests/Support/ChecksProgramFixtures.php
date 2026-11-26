<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Agents\Drivers\Hooks\HookPayload;
use App\Agents\Drivers\Hooks\JudgedCall;
use App\Contracts\Drivers\DriverCall;
use App\Support\Inputs\Contracts\HookInput;
use App\Support\Inputs\Values\HookIdentity;

/**
 * What the adapter tests of every driver share: its recorded fixture, its mapping as a data provider, and reading a
 * call's input.
 */
trait ChecksProgramFixtures
{
    /**
     * @return iterable<string, array{string, string}>
     */
    public static function mapping(): iterable
    {
        foreach (self::programFixture()->mapping() as $name => $expected) {
            yield $name => [
                $name,
                $expected,
            ];
        }
    }

    abstract protected static function fixtureFolder(): string;

    protected static function programFixture(): ProgramFixture
    {
        return ProgramFixture::load(static::fixtureFolder());
    }

    protected function payload(string $name): HookPayload
    {
        return self::programFixture()->payload($name);
    }

    protected function inputOf(DriverCall $call): HookInput
    {
        $this->assertInstanceOf(JudgedCall::class, $call);

        return $call->input;
    }

    protected function hook(): HookIdentity
    {
        return TestActors::hookIdentity(1, 10, 'call-1', hash('sha256', 'the input'));
    }
}
