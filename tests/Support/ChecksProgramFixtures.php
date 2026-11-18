<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Hooks\Contracts\HookInput;
use App\Hooks\Contracts\ProgramCall;
use App\Hooks\Inputs\HookIdentity;
use App\Hooks\Programs\HookPayload;
use App\Hooks\Programs\JudgedCall;

/**
 * What the adapter tests of every program share: its recorded fixture, its mapping as a data provider, and reading a call's input.
 */
trait ChecksProgramFixtures
{
    /**
     * @return iterable<string, array{string, string}>
     */
    public static function mapping(): iterable
    {
        foreach (self::programFixture()->mapping() as $name => $expected) {
            yield $name => [$name, $expected];
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

    protected function inputOf(ProgramCall $call): HookInput
    {
        $this->assertInstanceOf(JudgedCall::class, $call);

        return $call->input;
    }

    protected function hook(): HookIdentity
    {
        return new HookIdentity(TestIds::of(1), TestIds::of(10), 'call-1', hash('sha256', 'the input'));
    }
}
