<?php

declare(strict_types=1);

namespace Tests\Unit\Profiles;

use App\Profiles\Values\SignInVerification;
use PHPUnit\Framework\TestCase;

final class SignInVerificationTest extends TestCase
{
    private const string KEPT_REASON = 'unexpected status 401 Unauthorized: Incorrect API key provided: the key. '
        .'Find yours online.';

    public function test_a_refusal_keeps_the_reason_but_never_the_key_or_the_request_trace(): void
    {
        $refused = SignInVerification::refused(
            'unexpected status 401 Unauthorized: Incorrect API key provided: sk-proj-****abcd. Find yours online., '
                .'url: https://api.openai.com/v1/responses, request id: req_1',
        );

        $this->assertFalse($refused->isSignedIn);
        $this->assertSame(self::KEPT_REASON, $refused->refusal);
    }

    public function test_a_long_refusal_is_cut_short(): void
    {
        $this->assertSame(300, mb_strlen((string) SignInVerification::refused(str_repeat('a', 400))->refusal));
    }
}
