<?php

declare(strict_types=1);

namespace App\Sharing\Gateways\Support;

use App\Sharing\Exceptions\GatewaySecretRefused;
use Illuminate\Container\Attributes\Config;

/**
 * The gateways' secrets, each kept as a file named by its reference in the journal's private secrets folder, so a
 * secret never travels as a command argument, a setting or a receipt.
 */
final readonly class GatewaySecrets
{
    private const string REFERENCE = '/^[a-z0-9_-]+$/';

    public function __construct(#[Config('sharing.secrets_dir')] private string $folder) {}

    public function has(string $reference): bool
    {
        return self::isReference($reference) && is_file($this->path($reference));
    }

    /**
     * Whether the text can name a secret: lower-case letters, digits, dashes and underscores.
     */
    public static function isReference(string $reference): bool
    {
        return preg_match(self::REFERENCE, $reference) === 1;
    }

    /**
     * Keeps the secret's bytes under its reference, readable by the share service alone; only the reference is ever
     * written anywhere else.
     *
     * @throws GatewaySecretRefused when the reference names no secret
     */
    public function store(string $reference, string $secret): void
    {
        $path = $this->path($reference);

        if (! is_dir($this->folder)) {
            mkdir($this->folder, 0700, true);
        }

        file_put_contents($path, $secret, LOCK_EX);
        chmod($path, 0600);
    }

    /**
     * The secret's value; read only after has() said it is there.
     *
     * @throws GatewaySecretRefused when the reference names no secret
     */
    public function read(string $reference): string
    {
        return trim((string) file_get_contents($this->path($reference)));
    }

    /**
     * Where the secret of a reference is kept; a text that cannot name a secret never becomes a path.
     *
     * @throws GatewaySecretRefused when the reference names no secret
     */
    private function path(string $reference): string
    {
        if (! self::isReference($reference)) {
            throw GatewaySecretRefused::forReference($reference);
        }

        return "{$this->folder}/{$reference}";
    }
}
