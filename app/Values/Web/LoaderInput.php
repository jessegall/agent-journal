<?php

declare(strict_types=1);

namespace App\Values\Web;

use App\Exceptions\LoaderInputUnreadable;

/**
 * What one loader call sends in its X-Journal-Loader-Input header: base64url UTF-8 JSON of the call's token, which its
 * answer carries back, and the input its reader's Data is built from. The bounds of each field stay in that Data's
 * rules; this only bounds the header itself.
 */
final readonly class LoaderInput
{
    public const string HEADER = 'X-Journal-Loader-Input';

    /**
     * The most bytes the header may hold: three answers of 2000 four-byte characters fit, far below what Caddy and
     * RoadRunner allow.
     */
    public const int MOST_BYTES = 40960;

    private const string BASE64URL = '/^[A-Za-z0-9_-]*$/';

    private const string TOKEN = '/^[A-Za-z0-9_-]{1,64}$/';

    /**
     * @param  array<array-key, mixed>  $input
     */
    private function __construct(public string $token, public array $input) {}

    /**
     * @throws LoaderInputUnreadable when the header is too large, not base64url, not UTF-8 JSON of a token and an input
     */
    public static function fromHeader(string $header): self
    {
        if (strlen($header) > self::MOST_BYTES) {
            throw LoaderInputUnreadable::tooLarge(self::MOST_BYTES);
        }

        $json = preg_match(self::BASE64URL, $header) === 1 ? base64_decode(strtr($header, '-_', '+/'), true) : false;

        if ($json === false || ! mb_check_encoding($json, 'UTF-8') || ! json_validate($json)) {
            throw LoaderInputUnreadable::notEncoded();
        }

        $call = json_decode($json, true);
        $isCall = is_array($call) && is_string($call['token'] ?? null) && is_array($call['input'] ?? null);

        if (! $isCall || preg_match(self::TOKEN, $call['token']) !== 1) {
            throw LoaderInputUnreadable::notACall();
        }

        return new self($call['token'], $call['input']);
    }
}
