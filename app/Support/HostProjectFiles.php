<?php

declare(strict_types=1);

namespace App\Support;

use App\Commands\Projects\RequestProjectRead\RequestProjectReadCommand;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Hosts\ProjectFiles;
use App\Enums\Projects\ProjectReadType;
use App\Models\Projects\ProjectBinding;
use App\Values\ProjectFileAnswer;
use App\Values\ProjectFileAnswers;

/**
 * Reads a connected project's folders and files by asking its host through project reads, one request per view.
 */
final readonly class HostProjectFiles implements ProjectFiles
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
