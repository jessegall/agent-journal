<?php

declare(strict_types=1);

namespace Domain\Sharing\Support;

use Illuminate\Http\Request;

/**
 * How a gateway's forwarded requests name the visitor's address: by none, so forwarded headers are ignored, or by one
 * header the gateway is proven to overwrite. The loopback peer of the listener never names a visitor.
 */
final readonly class SourceAddressRule
{
    private function __construct(private string|null $header) {}

    public static function none(): self
    {
        return new self(null);
    }

    public static function forHeader(string $header): self
    {
        return new self($header);
    }

    /**
     * The visitor's address under this rule, or null when the rule trusts no header.
     */
    public function sourceOf(Request $request): string|null
    {
        if ($this->header === null) {
            return null;
        }

        $address = trim((string) $request->headers->get($this->header));

        if (filter_var($address, FILTER_VALIDATE_IP) === false) {
            return null;
        }

        return $address;
    }
}
