<?php

declare(strict_types=1);

namespace Tests\Unit\AgentRequests;

use App\AgentRequests\Contracts\CallRefusal;
use App\AgentRequests\Exceptions\CallKeyExpired;
use App\AgentRequests\Exceptions\CallRefused;
use App\AgentRequests\Exceptions\StateBlocked;
use App\AgentRequests\Support\CallKey;
use App\AgentRequests\Support\RefusalExceptions;
use App\Bus\Enums\RefusalCode;
use PHPUnit\Framework\TestCase;

/**
 * Every refusal code is thrown as its own class on the client, a call's declared refusal of the same code wins, and
 * an expired key never advises sending without one.
 */
final class RefusalExceptionsTest extends TestCase
{
    public function test_every_refusal_code_maps_to_its_own_class(): void
    {
        $classes = array_map(fn (RefusalCode $code) => RefusalExceptions::classOf($code->value, []), RefusalCode::cases());

        $this->assertCount(count(RefusalCode::cases()), array_unique($classes));

        foreach (RefusalCode::cases() as $code) {
            $this->assertSame($code->value, RefusalExceptions::classOf($code->value, [])::CODE);
        }
    }

    public function test_a_declared_refusal_of_the_same_code_wins(): void
    {
        $declared = new class('state_blocked', 'Blocked.', 'call-1', null) extends CallRefused implements CallRefusal
        {
            public const string CODE = 'state_blocked';

            public static function code(): string
            {
                return self::CODE;
            }
        };

        $this->assertSame($declared::class, RefusalExceptions::classOf('state_blocked', [$declared::class]));
        $this->assertSame(StateBlocked::class, RefusalExceptions::classOf('state_blocked', []));
    }

    public function test_an_expired_key_advises_checking_the_record_and_keeps_the_key(): void
    {
        $key = new CallKey('key-1');
        $expired = CallKeyExpired::answered('request_key_expired', 'Expired.', 'call-1', $key, []);

        $this->assertSame($key, $expired->retryKey());
        $this->assertStringContainsString('Check the record', implode("\n", $expired->consoleLines()));
        $this->assertStringNotContainsStringIgnoringCase('without a key', implode("\n", $expired->consoleLines()));
    }
}
