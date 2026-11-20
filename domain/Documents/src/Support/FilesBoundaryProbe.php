<?php

declare(strict_types=1);

namespace Domain\Documents\Support;

use App\Files\Contracts\Files;
use App\Files\Enums\Place;
use App\Files\Exceptions\FileMissing;
use App\Files\Values\FilePath;

final readonly class FilesBoundaryProbe
{
    public function __construct(private Files $files) {}

    public function body(): string
    {
        try {
            return $this->files->read(FilePath::in(Place::Project, 'README.md'));
        } catch (FileMissing $missing) {
            throw $missing;
        }
    }
}
