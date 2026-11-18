<?php

declare(strict_types=1);

namespace Domain\Documents\Console\Support;

use Illuminate\Filesystem\Filesystem;

/**
 * The token and version of the drafts this agent holds, kept in a file beside the agent so an edit can name the
 * version it was made on.
 */
final readonly class DraftTokens
{
    private const string FILE = 'journal-document-drafts.json';

    public function __construct(private Filesystem $files) {}

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
        $this->files->put($this->path(), json_encode($all, JSON_THROW_ON_ERROR));
    }

    public function forget(int $documentNumber): void
    {
        $all = $this->all();
        unset($all["doc {$documentNumber}"]);
        $this->files->put($this->path(), json_encode($all, JSON_THROW_ON_ERROR));
    }

    /**
     * @return array<string, mixed>
     */
    private function all(): array
    {
        return $this->files->exists($this->path()) ? $this->files->json($this->path(), JSON_THROW_ON_ERROR) : [];
    }

    private function path(): string
    {
        return sys_get_temp_dir().'/'.self::FILE;
    }
}
