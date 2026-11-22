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
    private const string RECORD_ADVICE = 'Check the record';

    private const string RESEND_ADVICE = 'without a key';

    public function test_every_shared_refusal_code_maps_to_its_own_class(): void
    {
        $shared = array_values(
            array_filter(RefusalCode::cases(), fn (RefusalCode $code) => ! $code->belongsToItsCalls()),
        );
        $classes = array_map(fn (RefusalCode $code) => RefusalExceptions::classOf($code->value, []), $shared);

        $this->assertCount(count($shared), array_unique($classes));

        foreach ($shared as $code) {
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
        $this->assertStringContainsString(self::RECORD_ADVICE, implode("\n", $expired->consoleLines()));
        $this->assertStringNotContainsStringIgnoringCase(self::RESEND_ADVICE, implode("\n", $expired->consoleLines()));
    }
}
