<?php

declare(strict_types=1);

namespace Tools\InstallationChecks;

use GuzzleHttp\Client;
use GuzzleHttp\Cookie\CookieJar;
use RuntimeException;

/**
 * The journal's pages over HTTP, signed in as one user, sending each request as the browser does: with the session's
 * cookies, its XSRF token and, for a keyed write, the Idempotency-Key the page sends.
 */
final readonly class Journal
{
    private Client $client;

    private CookieJar $cookies;

    public function __construct(string $origin)
    {
        $this->cookies = new CookieJar();
        $this->client = new Client([
            'base_uri' => rtrim($origin, '/'),
            'cookies' => $this->cookies,
            'http_errors' => false,
            'allow_redirects' => false,
            'timeout' => 30,
        ]);
    }

    public function signIn(string $email, string $password): void
    {
        $this->client->get('/login');
        $answer = $this->client->post('/login', [
            'headers' => $this->headers(),
            'form_params' => [
                'email' => $email,
                'password' => $password,
            ],
        ]);
        $location = $answer->getHeaderLine('Location');

        if ($answer->getStatusCode() !== 302 || str_ends_with($location, '/login')) {
            throw new RuntimeException("The journal refused the sign-in of {$email} ({$answer->getStatusCode()}).");
        }
    }

    /**
     * Opens a page as a visit does, so what the page opens on the way, such as a chat with an agent, exists.
     */
    public function visit(string $path): void
    {
        $answer = $this->client->get($path, ['headers' => $this->headers()]);

        if ($answer->getStatusCode() >= 400) {
            throw new RuntimeException("The journal answered {$answer->getStatusCode()} to {$path}.");
        }
    }

    /**
     * Sends a keyed write as the page does and fails with the journal's reason when it is refused.
     *
     * @param  array<string, mixed>  $body
     */
    public function postKeyed(string $path, array $body, string $key): void
    {
        $answer = $this->client->post($path, [
            'headers' => [
                ...$this->headers(),
                'Accept' => 'application/json',
                'Idempotency-Key' => $key,
            ],
            'json' => $body,
        ]);

        if ($answer->getStatusCode() >= 400) {
            throw new RuntimeException(
                "The journal refused {$path} ({$answer->getStatusCode()}): ".substr((string) $answer->getBody(), 0, 400),
            );
        }
    }

    /**
     * @return array<string, string>
     */
    private function headers(): array
    {
        $token = $this->cookies->getCookieByName('XSRF-TOKEN')?->getValue();

        if ($token === null) {
            return [];
        }

        return ['X-XSRF-TOKEN' => urldecode($token)];
    }
}
