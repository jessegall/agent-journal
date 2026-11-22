<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Files\Files;
use App\Enums\Permissions;
use App\Enums\Place;
use App\Exceptions\FileJsonInvalid;
use App\Exceptions\FileMissing;
use App\Exceptions\FileOutsidePlaces;
use App\Exceptions\FileReadReentered;
use App\Exceptions\FileUnreadable;
use App\Exceptions\LinkLeavesPlace;
use App\Exceptions\PlaceUnavailable;
use App\Values\Depth;
use App\Values\FilePath;
use App\Values\Fingerprint;
use App\Values\FolderEntries;
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
        private readonly PlaceRoots $roots,
        private readonly PathConfinement $confinement,
        private readonly FileContents $contents,
        private readonly FolderWalker $walker,
        private readonly CodeFiles $code,
        private readonly FileWriter $writer,
    ) {}

    public function filePathOf(string $absolutePath): FilePath
    {
        return $this->roots->filePathOf($absolutePath);
    }

    public function pathIn(Place $place, string $absolutePath): FilePath
    {
        return $this->roots->pathIn($place, $absolutePath);
    }

    public function realPath(FilePath $path): string
    {
        return $this->confinement->resolved($path);
    }

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

    public function readNamed(string $path): string
    {
        try {
            $file = $this->roots->filePathOf($path);
        } catch (FileOutsidePlaces) {
            return $this->readOutsidePlaces($path, null);
        }

        return $this->read($file);
    }

    public function readNamedAtMost(string $path, int $bytes): string
    {
        try {
            $file = $this->roots->filePathOf($path);
        } catch (FileOutsidePlaces) {
            return $this->readOutsidePlaces($path, $bytes);
        }

        return $this->readAtMost($file, $bytes);
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

        return $real !== null && is_file($real);
    }

    public function isLink(FilePath $path): bool
    {
        return is_link($this->confinement->entryPath($path));
    }

    public function linkTarget(FilePath $link): FilePath
    {
        $path = $this->confinement->entryPath($link);
        $target = is_link($path) ? readlink($path) : false;

        if ($target === false) {
            throw FileMissing::at($link->label());
        }

        try {
            $absolute = str_starts_with($target, '/') ? $target : dirname($path)."/{$target}";

            return $this->roots->pathIn($link->place, $absolute);
        } catch (FileOutsidePlaces $outside) {
            throw LinkLeavesPlace::from($link->label(), $outside);
        }
    }

    public function isFolder(FilePath $folder): bool
    {
        $real = $this->confinement->existingRealPath($folder);

        return $real !== null && is_dir($real);
    }

    public function fingerprint(FilePath $file): Fingerprint
    {
        return Fingerprint::of($file, $this->confinement->resolved($file));
    }

    public function list(FilePath $folder, Depth $depth = new Depth(1), string $pattern = '*'): FolderEntries
    {
        return $this->whileReading($folder, fn () => $this->walker->walk($folder, $depth, $pattern));
    }

    public function matching(FilePath $pattern): FolderEntries
    {
        return $this->whileReading($pattern, fn () => $this->walker->expand($pattern));
    }

    public function codeFolder(FilePath $pattern): FolderEntries
    {
        return $this->code->folder($pattern);
    }

    public function codeFile(FilePath $file): string
    {
        return $this->code->file($file);
    }

    public function write(FilePath $file, string $bytes, Permissions $permissions = Permissions::Shared): void
    {
        $real = $this->writablePath($file);
        $this->writer->replace($real, $bytes, $permissions->mode(), $file->label());
        $this->contents->drop($real);
    }

    public function create(FilePath $file, string $bytes, Permissions $permissions = Permissions::Shared): void
    {
        $real = $this->writablePath($file);
        $this->writer->create($real, $bytes, $permissions->mode(), $file->label());
        $this->contents->drop($real);
    }

    public function append(FilePath $file, string $line): void
    {
        $real = $this->writablePath($file);
        $this->writer->append($real, $line, Permissions::of($file->place)->mode(), $file->label());
        $this->contents->drop($real);
    }

    public function makeFolder(FilePath $folder, Permissions $permissions): void
    {
        $real = $this->confinement->resolvedForWrite($folder);
        $this->writer->makeFolderWithMode($real, $permissions->folderMode(), $folder->label());
    }

    public function delete(FilePath $file): void
    {
        $path = $this->confinement->entryPath($file);
        $this->writer->remove($path, $file->label());
        $this->contents->drop($path);
    }

    public function deleteFolder(FilePath $folder, Depth $depth): void
    {
        $this->writer->removeFolder($this->confinement->entryPath($folder), $depth->levels, $folder->label());
    }

    public function link(FilePath $link, FilePath $target): void
    {
        if ($target->place !== $link->place) {
            throw LinkLeavesPlace::from($link->label());
        }

        $path = $this->confinement->entryPath($link);
        $this->writer->link($path, $this->confinement->resolved($target), $link->label());
    }

    public function move(FilePath $from, FilePath $to): void
    {
        $fromPath = $this->confinement->entryPath($from);
        $toPath = $this->confinement->entryPath($to);
        $this->writer->move($fromPath, $toPath, $from->label());
        $this->contents->drop($fromPath);
        $this->contents->drop($toPath);
        clearstatcache(true, $fromPath);
        clearstatcache(true, $toPath);
    }

    public function locked(FilePath $lock, Closure $work): mixed
    {
        $mode = Permissions::of($lock->place)->mode();
        $handle = $this->writer->lockOpened($this->writablePath($lock), $mode, $lock->label());

        try {
            return $work();
        } finally {
            flock($handle, LOCK_UN);
            fclose($handle);
        }
    }

    public function scratch(Closure $work, string $extension = ''): mixed
    {
        $file = FilePath::in(Place::Temporary, 'journal-scratch-'.bin2hex(random_bytes(8)).$extension);

        try {
            return $work($file);
        } finally {
            $this->delete($file);
        }
    }

    public function freeSpace(Place $place): int
    {
        $free = disk_free_space($this->roots->root($place));

        if ($free === false) {
            throw PlaceUnavailable::for($place);
        }

        return (int) $free;
    }

    public function readCount(FilePath $file): int
    {
        return $this->contents->openCount($this->confinement->resolved($file));
    }

    /**
     * A file the user named that lies outside every place, read as named: the exemption the user settled for a
     * command's own file argument.
     */
    private function readOutsidePlaces(string $path, int|null $limit): string
    {
        if (! is_file($path)) {
            throw FileMissing::at($path);
        }

        $bytes = @file_get_contents($path, length: $limit === null ? null : max(0, $limit));

        if ($bytes === false) {
            throw FileUnreadable::at($path);
        }

        return $bytes;
    }

    /**
     * The real path a file is written at, inside its place and no closed folder, with its missing folders made.
     */
    private function writablePath(FilePath $file): string
    {
        $real = $this->confinement->resolvedForWrite($file);
        $this->writer->makeFolder(dirname($real), $file->place->folderMode(), $file->label());

        return $real;
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
            throw FileReadReentered::inside($this->reading->label(), $file->label());
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
            throw FileUnreadable::at($file->label());
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
            throw FileJsonInvalid::at($file->label(), $error->getMessage(), $error);
        }

        if (! is_array($decoded)) {
            throw FileJsonInvalid::at($file->label(), 'it holds a single '.get_debug_type($decoded));
        }

        return $decoded;
    }
}
