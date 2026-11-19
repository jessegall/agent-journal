<?php

declare(strict_types=1);

namespace App\AgentRequests\Support;

use App\AgentRequests\Exceptions\CallKeyInvalid;
use Illuminate\Support\Str;

/**
 * The request key a keyed write is sent under, so a repeat answers the first result: 1 to 64 letters, digits or
 * hyphens, a ULID when made fresh. It is not the bus's request-scoped RequestKey holder.
 */
final readonly class CallKey
{
    private const string PATTERN = '/^[A-Za-z0-9-]{1,64}$/D';

    public string $value;

    /**
     * @throws CallKeyInvalid
     */
    public function __construct(string|null $value = null)
    {
        $key = $value ?? Str::ulid()->toString();

        if (preg_match(self::PATTERN, $key) !== 1) {
            throw CallKeyInvalid::for($key);
        }

        $this->value = $key;
    }

    /**
     * The key a console option names, or a fresh one when the option is absent; a malformed one is refused before any
     * call.
     *
     * @throws CallKeyInvalid
     */
    public static function fromOption(string|null $option): self
    {
        return new self($option);
    }
}
