<?php

declare(strict_types=1);

namespace App\Files;

use App\Files\Values\Fingerprint;
use App\Files\Values\KeptDigest;
use App\Files\Values\KeptFile;
use Carbon\CarbonImmutable;
use Closure;
use Illuminate\Container\Attributes\Config;

/**
 * The bytes of settled files kept for repeated reads in one process, keyed by real path and dropped least recently
 * read first once they pass the byte limit. It counts every open it causes, per real path.
 */
final class FileContents
{
    /**
     * The kept files by real path, the least recently read first.
     *
     * @var array<string, KeptFile>
     */
    private array $kept = [];

    private int $keptBytes = 0;

    /**
     * @var array<string, int>
     */
    private array $opens = [];

    /**
     * The sha256 of each hashed file by real path.
     *
     * @var array<string, KeptDigest>
     */
    private array $digests = [];

    public function __construct(
        #[Config('journal.files.cached_bytes')]
        private readonly int $byteLimit,
        #[Config('journal.files.largest_cached_file')]
        private readonly int $fileByteLimit,
    ) {}

    /**
     * The file's bytes: the kept copy while its fingerprint holds, else the loader's, kept when the file allows.
     *
     * @param  Closure(): string  $loader
     */
    public function kept(Fingerprint $fingerprint, Closure $loader): string
    {
        if ($this->holds($fingerprint)) {
            return $this->touched($fingerprint)->bytes;
        }

        $bytes = $this->fresh($fingerprint, $loader);
        $this->keep(new KeptFile($fingerprint, $bytes, null));

        return $bytes;
    }

    /**
     * The file's decoded JSON, kept with its bytes; a parser that throws keeps nothing new.
     *
     * @param  Closure(string): array<array-key, mixed>  $parser
     * @param  Closure(): string  $loader
     * @return array<array-key, mixed>
     */
    public function decoded(Fingerprint $fingerprint, Closure $parser, Closure $loader): array
    {
        if (! $this->holds($fingerprint)) {
            return $this->keptDecoded($fingerprint, $this->fresh($fingerprint, $loader), $parser);
        }

        $file = $this->touched($fingerprint);

        if ($file->decoded === null) {
            return $this->keptDecoded($fingerprint, $file->bytes, $parser);
        }

        return $file->decoded;
    }

    /**
     * The loader's bytes, never kept, with the open counted.
     *
     * @param  Closure(): string  $loader
     */
    public function fresh(Fingerprint $fingerprint, Closure $loader): string
    {
        $this->opens[$fingerprint->realPath] = $this->openCount($fingerprint->realPath) + 1;

        return $loader();
    }

    /**
     * The file's sha256: the one hashed before while its fingerprint holds, else the hasher's, kept only for a file
     * that has settled, as kept bytes are.
     *
     * @param  Closure(): string  $hasher
     */
    public function digest(Fingerprint $fingerprint, Closure $hasher): string
    {
        $path = $fingerprint->realPath;

        if (isset($this->digests[$path]) && $this->digests[$path]->fingerprint->key() === $fingerprint->key()) {
            return $this->digests[$path]->digest;
        }

        $hashed = $this->fresh($fingerprint, $hasher);

        if ($fingerprint->isSettled(CarbonImmutable::now()->getTimestamp())) {
            $this->digests[$path] = new KeptDigest($fingerprint, $hashed);
        }

        return $hashed;
    }

    /**
     * Forgets the kept bytes, decoded JSON and digest of a file, as a write to it must.
     */
    public function drop(string $realPath): void
    {
        unset($this->digests[$realPath]);
        $this->forget($realPath);
    }

    public function openCount(string $realPath): int
    {
        return $this->opens[$realPath] ?? 0;
    }

    /**
     * How many bytes of file contents are kept now.
     */
    public function keptBytes(): int
    {
        return $this->keptBytes;
    }

    /**
     * Whether a copy is kept under this very fingerprint.
     */
    private function holds(Fingerprint $fingerprint): bool
    {
        $path = $fingerprint->realPath;

        return isset($this->kept[$path]) && $this->kept[$path]->fingerprint->key() === $fingerprint->key();
    }

    /**
     * The kept file, moved to the most recently read.
     */
    private function touched(Fingerprint $fingerprint): KeptFile
    {
        $file = $this->kept[$fingerprint->realPath];
        unset($this->kept[$fingerprint->realPath]);
        $this->kept[$fingerprint->realPath] = $file;

        return $file;
    }

    /**
     * @param  Closure(string): array<array-key, mixed>  $parser
     * @return array<array-key, mixed>
     */
    private function keptDecoded(Fingerprint $fingerprint, string $bytes, Closure $parser): array
    {
        $decoded = $parser($bytes);
        $this->keep(new KeptFile($fingerprint, $bytes, $decoded));

        return $decoded;
    }

    private function forget(string $realPath): void
    {
        if (! isset($this->kept[$realPath])) {
            return;
        }

        $this->keptBytes -= $this->kept[$realPath]->size();
        unset($this->kept[$realPath]);
    }

    private function keep(KeptFile $file): void
    {
        $this->forget($file->fingerprint->realPath);

        $isSettled = $file->fingerprint->isSettled(CarbonImmutable::now()->getTimestamp());

        if ($file->size() > $this->fileByteLimit || ! $isSettled) {
            return;
        }

        $this->kept[$file->fingerprint->realPath] = $file;
        $this->keptBytes += $file->size();

        while ($this->keptBytes > $this->byteLimit) {
            $this->forget((string) array_key_first($this->kept));
        }
    }
}
