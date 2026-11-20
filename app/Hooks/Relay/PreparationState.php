<?php

declare(strict_types=1);

namespace App\Hooks\Relay;

use Illuminate\Filesystem\Filesystem;
use JsonException;

/**
 * Whether the program's current context generation is prepared, kept by the host in a file beside the pending
 * envelopes so it holds while the journal is away. Each session start or compaction opens a new generation as
 * unprepared, and only the journal's successful answer to that same callback prepares it; a stale answer for an older
 * generation changes nothing. No file means no generation was ever prepared.
 */
final readonly class PreparationState
{
    public function __construct(
        private Filesystem $files,
        private string $file,
    ) {}

    public function openGeneration(string $generation): void
    {
        $this->write($generation, false);
    }

    public function prepare(string $generation): void
    {
        if ($this->storedState()['generation'] === $generation) {
            $this->write($generation, true);
        }
    }

    public function isPrepared(): bool
    {
        return $this->storedState()['prepared'];
    }

    /**
     * @return array{generation: string|null, prepared: bool}
     */
    private function storedState(): array
    {
        if (! $this->files->exists($this->file)) {
            return ['generation' => null, 'prepared' => false];
        }

        try {
            $stored = json_decode($this->files->get($this->file), true, 4, JSON_THROW_ON_ERROR);
        } catch (JsonException) {
            return ['generation' => null, 'prepared' => false];
        }

        $generation = is_array($stored) ? $stored['generation'] ?? null : null;

        return [
            'generation' => is_string($generation) ? $generation : null,
            'prepared' => is_array($stored) && ($stored['prepared'] ?? false) === true,
        ];
    }

    private function write(string $generation, bool $prepared): void
    {
        $this->files->put(
            $this->file,
            json_encode(['generation' => $generation, 'prepared' => $prepared], JSON_THROW_ON_ERROR),
            true,
        );
    }
}
