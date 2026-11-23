<?php

declare(strict_types=1);

namespace App\Contracts\Hosts;

use App\Models\ProjectBinding;
use App\Values\ProjectFileAnswer;

/**
 * The folders and files of a connected project, read through its host for the owner: each answer is pending until
 * the host reports it.
 */
interface ProjectFiles
{
    public function folder(ProjectBinding $binding, string $path): ProjectFileAnswer;

    public function file(ProjectBinding $binding, string $path): ProjectFileAnswer;
}
