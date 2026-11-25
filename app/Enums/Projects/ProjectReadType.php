<?php

declare(strict_types=1);

namespace App\Enums\Projects;

/**
 * What a read of a connected project asks its host for: a folder's entries or a file's text.
 */
enum ProjectReadType: string
{
    case Directory = 'directory';
    case File = 'file';
}
