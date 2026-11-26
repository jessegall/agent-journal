<?php

declare(strict_types=1);

namespace Domain\Documents\Console\Commands\Support;

use App\Files\Contracts\Files;
use App\Files\Enums\Place;
use App\Values\FilePath;

/**
 * The token and version of the drafts this agent holds, kept in a file beside the agent so an edit can name the
 * version it was made on.
 */
final readonly class DraftTokens
{
    private const string FILE = 'journal-document-drafts.json';

    public function __construct(private Files $files) {}

    /**
     * @return array{token: string, version: int}|null
     */
    public function of(int $documentNumber): array|null
    {
        $held = $this->all()["doc {$documentNumber}"] ?? null;

        if (is_array($held)) {
            return [
                'token' => (string) $held['token'],
                'version' => (int) $held['version'],
            ];
        }

        return null;
    }

    public function keep(int $documentNumber, string $token, int $version): void
    {
        $drafts = $this->all();

        $drafts["doc {$documentNumber}"] = [
            'token' => $token,
            'version' => $version,
        ];

        $this->files->write($this->path(), json_encode($drafts, JSON_THROW_ON_ERROR));
    }

    public function forget(int $documentNumber): void
    {
        $drafts = $this->all();
        unset($drafts["doc {$documentNumber}"]);
        $this->files->write($this->path(), json_encode($drafts, JSON_THROW_ON_ERROR));
    }

    /**
     * @return array<array-key, mixed>
     */
    private function all(): array
    {
        if ($this->files->exists($this->path())) {
            return $this->files->readJson($this->path());
        }

        return [];
    }

    private function path(): FilePath
    {
        return FilePath::in(Place::Temporary, self::FILE);
    }
}
