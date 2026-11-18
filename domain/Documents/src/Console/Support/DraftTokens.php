<?php

declare(strict_types=1);

namespace Domain\Documents\Console\Support;

/**
 * The token and version of the drafts this agent holds, kept in a file beside the agent so an edit can name the
 * version it was made on.
 */
final readonly class DraftTokens
{
    private string $path;

    public function __construct()
    {
        $this->path = sys_get_temp_dir().'/journal-document-drafts.json';
    }

    /**
     * @return array{token: string, version: int}|null
     */
    public function of(int $documentNumber): array|null
    {
        $held = $this->all()["doc {$documentNumber}"] ?? null;

        return is_array($held) ? ['token' => (string) $held['token'], 'version' => (int) $held['version']] : null;
    }

    public function keep(int $documentNumber, string $token, int $version): void
    {
        $all = $this->all();
        $all["doc {$documentNumber}"] = ['token' => $token, 'version' => $version];
        file_put_contents($this->path, json_encode($all, JSON_THROW_ON_ERROR));
    }

    public function forget(int $documentNumber): void
    {
        $all = $this->all();
        unset($all["doc {$documentNumber}"]);
        file_put_contents($this->path, json_encode($all, JSON_THROW_ON_ERROR));
    }

    /**
     * @return array<string, mixed>
     */
    private function all(): array
    {
        $stored = is_file($this->path) ? json_decode((string) file_get_contents($this->path), true) : [];

        return is_array($stored) ? $stored : [];
    }
}
