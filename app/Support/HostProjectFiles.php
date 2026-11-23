<?php

declare(strict_types=1);

namespace App\Support;

use App\Commands\RequestProjectRead\RequestProjectReadCommand;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Hosts\ProjectFiles;
use App\Enums\ProjectReadType;
use App\Models\ProjectBinding;
use App\Values\ProjectFileAnswer;

/**
 * Reads a connected project's folders and files by asking its host through a project read.
 */
final readonly class HostProjectFiles implements ProjectFiles
{
    public function __construct(private CommandBus $commands) {}

    public function folder(ProjectBinding $binding, string $path): ProjectFileAnswer
    {
        return $this->commands->run(new RequestProjectReadCommand($binding->id, ProjectReadType::Directory, $path));
    }

    public function file(ProjectBinding $binding, string $path): ProjectFileAnswer
    {
        return $this->commands->run(new RequestProjectReadCommand($binding->id, ProjectReadType::File, $path));
    }
}
