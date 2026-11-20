<?php

declare(strict_types=1);

namespace App\Files\Support;

use App\Files\Values\Fingerprint;
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

    public function __construct(
        #[Config('files.cached_bytes')]
        private readonly int $byteLimit,
        #[Config('files.largest_cached_file')]
        private readonly int $fileByteLimit,
    ) {}

    /**
     * The file's bytes: the kept copy while its fingerprint holds, else the loader's, kept when the file allows.
     *
     * @param  Closure(): string  $loader
     */
    public function kept(Fingerprint $fingerprint, Closure $loader): string
    {
        $file = $this->keptUnder($fingerprint);

        if ($file !== null) {
            return $file->bytes;
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
        $file = $this->keptUnder($fingerprint);

        if ($file?->decoded !== null) {
            return $file->decoded;
        }

        $bytes = $file === null ? $this->fresh($fingerprint, $loader) : $file->bytes;
        $decoded = $parser($bytes);
        $this->keep(new KeptFile($fingerprint, $bytes, $decoded));

        return $decoded;
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

    public function drop(string $realPath): void
    {
        if (! isset($this->kept[$realPath])) {
            return;
        }

        $this->keptBytes -= $this->kept[$realPath]->size();
        unset($this->kept[$realPath]);
    }

    public function openCount(string $realPath): int
    {
        return $this->opens[$realPath] ?? 0;
    }

    /**
     * The kept file under this very fingerprint, moved to the most recently read; a kept copy of an older
     * fingerprint is dropped.
     */
    private function keptUnder(Fingerprint $fingerprint): KeptFile|null
    {
        $file = $this->kept[$fingerprint->realPath] ?? null;
        $this->drop($fingerprint->realPath);

        if ($file === null || $file->fingerprint->key() !== $fingerprint->key()) {
            return null;
        }

        $this->kept[$fingerprint->realPath] = $file;
        $this->keptBytes += $file->size();

        return $file;
    }

    private function keep(KeptFile $file): void
    {
        $this->drop($file->fingerprint->realPath);

        if ($file->size() > $this->fileByteLimit || ! $file->fingerprint->isSettled(CarbonImmutable::now()->getTimestamp())) {
            return;
        }

        $this->kept[$file->fingerprint->realPath] = $file;
        $this->keptBytes += $file->size();

        while ($this->keptBytes > $this->byteLimit) {
            $this->drop((string) array_key_first($this->kept));
        }
    }
}
