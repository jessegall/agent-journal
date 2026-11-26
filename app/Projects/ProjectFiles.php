<?php

declare(strict_types=1);

namespace App\Projects;

use App\Bus\Contracts\CommandBus;
use App\Hosts\Contracts\ProjectFiles as ProjectFilesContract;
use App\Models\Projects\ProjectBinding;
use App\Projects\Commands\RequestProjectRead\RequestProjectReadCommand;
use App\Projects\Enums\ProjectReadType;
use App\Values\ProjectFileAnswer;
use App\Values\ProjectFileAnswers;

/**
 * Reads a connected project's folders and files by asking its host through project reads, one request per view.
 */
final readonly class ProjectFiles implements ProjectFilesContract
{
    public function __construct(private CommandBus $commands) {}

    public function folders(ProjectBinding $binding, array $paths): ProjectFileAnswers
    {
        return $this->commands->run(new RequestProjectReadCommand($binding->id, ProjectReadType::Directory, $paths));
    }

    public function file(ProjectBinding $binding, string $path): ProjectFileAnswer
    {
        return $this->commands->run(new RequestProjectReadCommand($binding->id, ProjectReadType::File, [$path]))
            ->of($path);
    }
}
