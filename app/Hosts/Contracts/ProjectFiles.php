<?php

declare(strict_types=1);

namespace App\Hosts\Contracts;

use App\Models\Projects\ProjectBinding;
use App\Values\ProjectFileAnswer;
use App\Values\ProjectFileAnswers;

/**
 * The folders and files of a connected project, read through its host for the owner: each answer is pending until
 * the host reports it. A view asks for all the folders it shows at once.
 */
interface ProjectFiles
{
    /**
     * @param  list<string>  $paths
     */
    public function folders(ProjectBinding $binding, array $paths): ProjectFileAnswers;

    /**
     * The file at the path in the binding's project folder, or why it cannot be read.
     */
    public function file(ProjectBinding $binding, string $path): ProjectFileAnswer;
}
