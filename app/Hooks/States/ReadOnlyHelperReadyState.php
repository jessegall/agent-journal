<?php

declare(strict_types=1);

namespace App\Hooks\States;

use App\Hooks\Decisions\Decision;
use App\Hooks\Inputs\FileEditRequested;

/**
 * The bottom state of a read-only helper: it edits no file. What its shell lines may run is Core's admission to
 * decide, by the role's ceiling.
 */
class ReadOnlyHelperReadyState extends HelperReadyState
{
    public function onFileEdit(FileEditRequested $input): Decision
    {
        $paths = implode(', ', $input->changes->paths());

        return Decision::deny("A read-only helper changes no files, so this edit of {$paths} is refused.");
    }
}
