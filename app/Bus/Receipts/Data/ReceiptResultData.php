<?php

declare(strict_types=1);

namespace App\Bus\Receipts\Data;

use App\Support\PlainValue;
use Spatie\LaravelData\Data;

/**
 * The answer a receipted write got, as its receipt keeps it: the answer as a plain value a reader can show, and the
 * answer itself serialized, which a replay returns again.
 */
final class ReceiptResultData extends Data
{
    public function __construct(
        public readonly mixed $value,
        public readonly string $php,
    ) {}

    public static function of(mixed $reply): self
    {
        $value = PlainValue::of($reply);
        $serialized = serialize($reply);

        return new self($value, base64_encode($serialized));
    }

    /**
     * The answer itself again.
     */
    public function reply(): mixed
    {
        $serialized = base64_decode($this->php);

        return unserialize($serialized);
    }
}
