<?php

declare(strict_types=1);

namespace App\Files\Support;

use App\Files\Contracts\Files;
use App\Files\Exceptions\FileJsonInvalid;
use App\Files\Exceptions\FileReadReentered;
use App\Files\Exceptions\FileUnreadable;
use App\Files\Values\FilePath;
use App\Files\Values\Fingerprint;
use Closure;
use JsonException;

/**
 * The files of the places on this machine's disk. Each read holds this worker's read flag, so a read started inside
 * another is refused; a private place's file is opened on every read and never kept.
 */
final class LocalFiles implements Files
{
    /**
     * The file being read now; none between reads.
     */
    private FilePath|null $reading = null;

    public function __construct(
        private readonly PathConfinement $confinement,
        private readonly FileContents $contents,
    ) {}

    public function read(FilePath $file): string
    {
        return $this->whileReading($file, function () use ($file) {
            $fingerprint = Fingerprint::of($file, $this->confinement->resolved($file));
            $loader = fn () => $this->loaded($file, $fingerprint, null);

            return $file->place->isPrivate()
                ? $this->contents->fresh($fingerprint, $loader)
                : $this->contents->kept($fingerprint, $loader);
        });
    }

    public function readAtMost(FilePath $file, int $bytes): string
    {
        return $this->whileReading($file, function () use ($file, $bytes) {
            $fingerprint = Fingerprint::of($file, $this->confinement->resolved($file));

            return $this->contents->fresh($fingerprint, fn () => $this->loaded($file, $fingerprint, $bytes));
        });
    }

    public function readJson(FilePath $file): array
    {
        return $this->whileReading($file, function () use ($file) {
            $fingerprint = Fingerprint::of($file, $this->confinement->resolved($file));
            $loader = fn () => $this->loaded($file, $fingerprint, null);
            $parser = fn (string $bytes) => $this->decoded($file, $bytes);

            return $file->place->isPrivate()
                ? $parser($this->contents->fresh($fingerprint, $loader))
                : $this->contents->decoded($fingerprint, $parser, $loader);
        });
    }

    public function digest(FilePath $file): string
    {
        return $this->whileReading($file, function () use ($file) {
            $fingerprint = Fingerprint::of($file, $this->confinement->resolved($file));
            $hasher = fn () => $this->hashed($file, $fingerprint);

            return $file->place->isPrivate()
                ? $this->contents->fresh($fingerprint, $hasher)
                : $this->contents->digest($fingerprint, $hasher);
        });
    }

    public function exists(FilePath $file): bool
    {
        $real = $this->confinement->existingRealPath($file);

        return $real !== false && is_file($real);
    }

    public function isFolder(FilePath $folder): bool
    {
        $real = $this->confinement->existingRealPath($folder);

        return $real !== false && is_dir($real);
    }

    public function fingerprint(FilePath $file): Fingerprint
    {
        return Fingerprint::of($file, $this->confinement->resolved($file));
    }

    public function readCount(FilePath $file): int
    {
        return $this->contents->openCount($this->confinement->resolved($file));
    }

    /**
     * Runs a read while holding the read flag, refusing it when another read holds the flag already.
     *
     * @template T
     *
     * @param  Closure(): T  $read
     * @return T
     */
    private function whileReading(FilePath $file, Closure $read): mixed
    {
        if ($this->reading !== null) {
            throw FileReadReentered::inside($this->reading, $file);
        }

        $this->reading = $file;

        try {
            return $read();
        } finally {
            $this->reading = null;
        }
    }

    /**
     * The file's bytes, all of them or at most a limit, from a handle checked to be the file fingerprinted.
     */
    private function loaded(FilePath $file, Fingerprint $fingerprint, int|null $limit): string
    {
        $handle = $this->confinement->opened($file, $fingerprint->realPath, 'rb');

        try {
            $bytes = stream_get_contents($handle, $limit);
        } finally {
            fclose($handle);
        }

        if ($bytes === false) {
            throw FileUnreadable::at($file);
        }

        return $bytes;
    }

    private function hashed(FilePath $file, Fingerprint $fingerprint): string
    {
        $handle = $this->confinement->opened($file, $fingerprint->realPath, 'rb');
        $hash = hash_init('sha256');

        try {
            hash_update_stream($hash, $handle);
        } finally {
            fclose($handle);
        }

        return hash_final($hash);
    }

    /**
     * @return array<array-key, mixed>
     */
    private function decoded(FilePath $file, string $bytes): array
    {
        try {
            $decoded = json_decode($bytes, true, 512, JSON_THROW_ON_ERROR);
        } catch (JsonException $error) {
            throw FileJsonInvalid::at($file, $error->getMessage(), $error);
        }

        if (! is_array($decoded)) {
            throw FileJsonInvalid::at($file, 'it holds a single '.get_debug_type($decoded));
        }

        return $decoded;
    }
}
