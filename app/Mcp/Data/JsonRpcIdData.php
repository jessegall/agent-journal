<?php

declare(strict_types=1);

namespace App\Mcp\Data;

use JsonException;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Exceptions\CannotCreateData;
use TypeError;

/**
 * The id of a message the relay refuses whole, read only to address the refusal.
 */
final class JsonRpcIdData extends Data
{
    public function __construct(public readonly int|string|null $id = null) {}

    /**
     * The id a JSON-RPC message names, or none when it is not JSON or names no id.
     */
    public static function idIn(string $json): int|string|null
    {
        try {
            return JsonRpcIdData::from(json_decode($json, true, 512, JSON_THROW_ON_ERROR))->id;
        } catch (JsonException|CannotCreateData|TypeError) {
            return null;
        }
    }
}
