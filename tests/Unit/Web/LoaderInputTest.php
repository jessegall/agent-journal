<?php

declare(strict_types=1);

namespace Tests\Unit\Web;

use App\Exceptions\LoaderInputUnreadable;
use App\Values\Web\LoaderInput;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;

/**
 * A loader call's input header is read only when it is base64url UTF-8 JSON of a token and an input, within its
 * byte bound; three draft answers of 2000 four-byte characters fit.
 */
final class LoaderInputTest extends TestCase
{
    public function test_a_good_call_gives_its_token_and_input(): void
    {
        $input = LoaderInput::fromHeader(self::encoded(['token' => 't1', 'input' => ['inboxId' => 'i-1']]));

        $this->assertSame(['t1', ['inboxId' => 'i-1']], [$input->token, $input->input]);
    }

    public function test_three_answers_of_2000_four_byte_characters_fit(): void
    {
        $answer = str_repeat('😀', 2000);
        $header = self::encoded([
            'token' => 't1',
            'input' => ['noun' => 'plan', 'answers' => [$answer, $answer, $answer]],
        ]);

        $this->assertLessThanOrEqual(LoaderInput::MOST_BYTES, strlen($header));
        $this->assertSame($answer, LoaderInput::fromHeader($header)->input['answers'][2]);
    }

    public function test_a_header_past_the_bound_is_refused(): void
    {
        $this->expectExceptionObject(LoaderInputUnreadable::tooLarge(LoaderInput::MOST_BYTES));

        LoaderInput::fromHeader(str_repeat('a', LoaderInput::MOST_BYTES + 1));
    }

    /**
     * @return array<string, array{string, LoaderInputUnreadable}>
     */
    public static function unreadableHeaders(): array
    {
        return [
            'not base64url' => ['eyJ0b2tlbiI6InQxIn0=+/', LoaderInputUnreadable::notEncoded()],
            'not JSON' => [self::base64url('{token'), LoaderInputUnreadable::notEncoded()],
            'not UTF-8' => [self::base64url("\xff\xfe"), LoaderInputUnreadable::notEncoded()],
            'no input' => [self::encoded(['token' => 't1']), LoaderInputUnreadable::notACall()],
            'empty token' => [self::encoded(['token' => '', 'input' => []]), LoaderInputUnreadable::notACall()],
            'token with a space' => [
                self::encoded(['token' => 't 1', 'input' => []]),
                LoaderInputUnreadable::notACall(),
            ],
            'token too long' => [
                self::encoded(['token' => str_repeat('t', 65), 'input' => []]),
                LoaderInputUnreadable::notACall(),
            ],
        ];
    }

    #[DataProvider('unreadableHeaders')]
    public function test_an_unreadable_header_is_refused(string $header, LoaderInputUnreadable $refusal): void
    {
        $this->expectExceptionObject($refusal);

        LoaderInput::fromHeader($header);
    }

    /**
     * @param  array<string, mixed>  $call
     */
    private static function encoded(array $call): string
    {
        return self::base64url((string) json_encode($call, JSON_UNESCAPED_UNICODE));
    }

    private static function base64url(string $bytes): string
    {
        return rtrim(strtr(base64_encode($bytes), '+/', '-_'), '=');
    }
}
