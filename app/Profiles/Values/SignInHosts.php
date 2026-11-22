<?php

declare(strict_types=1);

namespace App\Profiles\Values;

/**
 * The provider hosts a driver's sign-in pages live on: an address is one of them only over HTTPS, with no user or
 * port, on one of the hosts or below it. A sign-in shows the user no other link.
 */
final readonly class SignInHosts
{
    /**
     * @param  list<string>  $hosts
     */
    public function __construct(private array $hosts) {}

    public static function anthropic(): self
    {
        return new self(['claude.ai', 'claude.com', 'anthropic.com']);
    }

    public static function openAi(): self
    {
        return new self(['auth.openai.com', 'chatgpt.com']);
    }

    public function admits(string $address): bool
    {
        $parts = parse_url($address);
        $host = strtolower((string) ($parts['host'] ?? ''));

        if (($parts['scheme'] ?? '') !== 'https' || isset($parts['user']) || isset($parts['port']) || $host === '') {
            return false;
        }

        foreach ($this->hosts as $trusted) {
            if ($host === $trusted || str_ends_with($host, '.'.$trusted)) {
                return true;
            }
        }

        return false;
    }
}
