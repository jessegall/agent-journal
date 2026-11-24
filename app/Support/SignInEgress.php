<?php

declare(strict_types=1);

namespace App\Support;

/**
 * The way out a sign-in driver takes on a server: the allow-list proxy the contained arrangement names
 * (JOURNAL_EGRESS_PROXY), so no sign-in, check or sign-out reaches a provider around it. With no
 * proxy set, as on the Mac, it adds nothing.
 */
final readonly class SignInEgress
{
    public function __construct(private string $proxy) {}

    /**
     * The proxy variables both lowercase and uppercase, since drivers read either, with the journal's own app
     * reached directly; none when no proxy is set.
     *
     * @return array<string, string>
     */
    public function variables(): array
    {
        if ($this->proxy === '') {
            return [];
        }

        return [
            'HTTPS_PROXY' => $this->proxy,
            'HTTP_PROXY' => $this->proxy,
            'https_proxy' => $this->proxy,
            'http_proxy' => $this->proxy,
            'NO_PROXY' => 'app',
            'no_proxy' => 'app',
        ];
    }
}
