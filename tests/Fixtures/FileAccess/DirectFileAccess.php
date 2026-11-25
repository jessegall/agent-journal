<?php

declare(strict_types=1);

namespace Tests\Fixtures\FileAccess;

use App\Attributes\OutsideThePlaces;
use App\Enums\Files\PlaceExemption;
use FilesystemIterator;
use Illuminate\Filesystem\Filesystem;
use Illuminate\Support\Facades\File;
use Illuminate\Validation\Rules\File as FileRule;
use RecursiveDirectoryIterator;
use Symfony\Component\Finder\Finder;

use function hash_file;

/**
 * Every form of direct file access the architecture test catches, beside the look-alikes it leaves alone. Never run.
 */
final class DirectFileAccess
{
    public function __construct(private Filesystem $files) {}

    /**
     * @return list<mixed>
     */
    public function caught(string $path): array
    {
        return [
            file_get_contents($path),
            \file_put_contents($path, 'bytes'),
            fopen($path, 'rb'),
            is_dir($path),
            glob("{$path}/*.php"),
            hash_file('sha256', $path),
            new RecursiveDirectoryIterator($path),
            new FilesystemIterator($path),
            Finder::create()->in($path),
            File::get($path),
            $this->files,
        ];
    }

    /**
     * @param  resource  $stream
     * @return list<mixed>
     */
    public function leftAlone(Linker $linker, $stream): array
    {
        $linker->unlink();

        return [
            $linker->rename('label'),
            Linker::file(),
            fwrite($stream, 'bytes'),
            fread($stream, 10),
            stream_get_contents($stream),
            fclose($stream),
            fopen('php://stdin', 'rb'),
            fopen('php://memory', 'w+'),
            file_get_contents('php://stdin'),
            FileRule::types(['pdf']),
        ];
    }

    #[OutsideThePlaces(PlaceExemption::UserNamedFile)]
    public function exempt(string $path): string|false
    {
        return file_get_contents($path);
    }
}
