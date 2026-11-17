<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Core\Hooks\Contracts\HookInput;
use App\Core\Hooks\Contracts\NativeCall;
use App\Core\Hooks\Inputs\HookIdentity;
use App\Core\Hooks\Programs\HookPayload;
use App\Core\Hooks\Programs\JournalCall;

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

    protected function inputOf(NativeCall $call): HookInput
    {
        $this->assertInstanceOf(JournalCall::class, $call);

        return $call->input;
    }

    protected function hook(): HookIdentity
    {
        return new HookIdentity(1, 10, 'call-1', hash('sha256', 'the input'));
    }
}
