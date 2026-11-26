<?php

declare(strict_types=1);

namespace App\Samples;

use App\Attributes\Rules\OutsideThePlaces;
use App\Files\Enums\PlaceExemption;

/**
 * Planted direct file calls the direct-file-access rule must find, beside the look-alikes it must pass: methods and
 * static calls that share a function's name, a php:// stream, a read on an open stream and a settled exemption.
 */
final class DirectFileAccess
{
    /**
     * @return list<mixed>
     */
    public function caught(string $path, string $target): array
    {
        return [
            // @sin DirectFileAccessDetector
            file_get_contents($path),
            // @sin DirectFileAccessDetector
            is_dir($path),
            // @sin DirectFileAccessDetector
            glob("{$path}/*.php"),
            // @sin DirectFileAccessDetector
            fopen($path, 'rb'),
            // @sin DirectFileAccessDetector
            realpath($path),
            // @sin DirectFileAccessDetector
            mkdir($path),
            // @sin DirectFileAccessDetector
            hash_file('sha256', $path),
            // @sin DirectFileAccessDetector
            readlink($path),
            // @sin DirectFileAccessDetector
            symlink($target, $path),
            // @sin DirectFileAccessDetector
            tempnam($path, 'x'),
            // @sin DirectFileAccessDetector
            unlink($path),
            // @sin DirectFileAccessDetector
            rename($path, $target),
            // @sin DirectFileAccessDetector
            file($path),
        ];
    }

    /**
     * @param  resource  $stream
     * @return list<mixed>
     */
    public function leftAlone(SampleLinker $linker, $stream): array
    {
        return [
            // @righteous DirectFileAccessDetector
            $linker->unlink(),
            // @righteous DirectFileAccessDetector
            $linker->rename('label'),
            // @righteous DirectFileAccessDetector
            SampleLinker::file(),
            // @righteous DirectFileAccessDetector
            fopen('php://stdin', 'rb'),
            // @righteous DirectFileAccessDetector
            fread($stream, 10),
        ];
    }

    #[OutsideThePlaces(PlaceExemption::UserNamedFile)]
    public function settled(string $path): string|false
    {
        // @righteous DirectFileAccessDetector
        return file_get_contents($path);
    }
}

/**
 * Methods that share the names of file functions without touching the disk.
 */
final class SampleLinker
{
    public function unlink(): void {}

    public function rename(string $label): string
    {
        return $label;
    }

    public static function file(): string
    {
        return 'a record';
    }
}
