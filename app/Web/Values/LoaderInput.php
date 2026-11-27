<?php

declare(strict_types=1);

namespace App\Web\Values;

use App\Web\Exceptions\LoaderInputUnreadable;
use Illuminate\Validation\ValidationException;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Exceptions\CannotCreateData;

/**
 * What one loader call sends in its X-Journal-Loader-Input header: base64url UTF-8 JSON of the call's token, which its
 * answer carries back, and the input its reader's Data is built from. The bounds of each field stay in that Data's
 * rules; this only bounds the header itself.
 */
final class LoaderInput extends Data
{
    public const string HEADER = 'X-Journal-Loader-Input';

    /**
     * The most bytes the header may hold: three answers of 2000 four-byte characters fit, far below what Caddy and
     * RoadRunner allow.
     */
    public const int BYTE_LIMIT = 40960;

    private const string BASE64URL = '/^[A-Za-z0-9_-]*$/';

    private const string TOKEN = '/^[A-Za-z0-9_-]{1,64}$/';

    /**
     * @param  array<array-key, mixed>  $input
     */
    public function __construct(public readonly string $token, public readonly array $input) {}

    /**
     * @return array<string, list<string>>
     */
    public static function rules(): array
    {
        return [
            'token' => [
                'required',
                'string',
                'regex:'.self::TOKEN,
            ],
            'input' => [
                'present',
                'array',
            ],
        ];
    }

    /**
     * @throws LoaderInputUnreadable when the header is too large, not base64url, not UTF-8 JSON of a token and an input
     */
    public static function fromHeader(string $header): self
    {
        if (strlen($header) > self::BYTE_LIMIT) {
            throw LoaderInputUnreadable::tooLarge(self::BYTE_LIMIT);
        }

        $json = preg_match(self::BASE64URL, $header) === 1 ? base64_decode(strtr($header, '-_', '+/'), true) : false;

        if ($json === false || ! mb_check_encoding($json, 'UTF-8') || ! json_validate($json)) {
            throw LoaderInputUnreadable::notEncoded();
        }

        try {
            return LoaderInput::validateAndCreate(json_decode($json, true));
        } catch (ValidationException|CannotCreateData $refused) {
            throw LoaderInputUnreadable::notACall($refused);
        }
    }
}
