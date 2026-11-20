<?php

declare(strict_types=1);

namespace Tests\Fixtures\FileAccess;

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

    public function caught(string $path): void
    {
        file_get_contents($path);
        \file_put_contents($path, 'bytes');
        fopen($path, 'rb');
        is_dir($path);
        glob("{$path}/*.php");
        hash_file('sha256', $path);
        new RecursiveDirectoryIterator($path);
        new FilesystemIterator($path);
        Finder::create()->in($path);
        File::get($path);
    }

    public function leftAlone(object $linker, object $task, $stream): void
    {
        $linker->unlink();
        $linker->rename('label');
        $task::file();
        fwrite($stream, 'bytes');
        fread($stream, 10);
        fclose($stream);
        stream_get_contents($stream);
        fopen('php://stdin', 'rb');
        fopen('php://memory', 'w+');
        file_get_contents('php://stdin');
        FileRule::types(['pdf']);
        \Tests\Fixtures\FileAccess\file('not the global one');
    }
}
