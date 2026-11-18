<?php

declare(strict_types=1);

namespace App\Sharing\Gateways\Support;

use Illuminate\Container\Attributes\Config;

/**
 * The gateways' secrets, each kept as a file named by its reference in the journal's private secrets folder, so a
 * secret never travels as a command argument, a setting or a receipt.
 */
final readonly class GatewaySecrets
{
    public function __construct(#[Config('sharing.secrets_dir')] private string $folder) {}

    public function has(string $reference): bool
    {
        return preg_match('/^[a-z0-9_-]+$/', $reference) === 1 && is_file($this->path($reference));
    }

    /**
     * The secret's value; read only after has() said it is there.
     */
    public function read(string $reference): string
    {
        return trim((string) file_get_contents($this->path($reference)));
    }

    private function path(string $reference): string
    {
        return "{$this->folder}/{$reference}";
    }
}
