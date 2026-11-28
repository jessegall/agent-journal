<?php

declare(strict_types=1);

namespace Tests\Support\Recordings;

use App\Files\Enums\Place;
use App\Support\Recordings\Recordings;
use App\Values\FilePath;

final class TerminalCapture
{
    public static function folderOf(string $driver, string $name): FilePath
    {
        return FilePath::in(Place::Project, Recordings::FOLDER."/compatibility/{$driver}/{$name}");
    }
}
