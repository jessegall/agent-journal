<?php

declare(strict_types=1);

namespace App\Http\Pages\Resolvers;

use App\Connections\ConnectedProjects;
use App\Connections\Data\ConnectProjectWindowData;
use App\Http\Requests\Connections\ConnectProjectRequest;
use App\Navigation\Contracts\PageResolver;

final readonly class ConnectProjectWindowResolver implements PageResolver
{
    public function __construct(private ConnectedProjects $projects, private ConnectProjectRequest $request) {}

    public function read(): ConnectProjectWindowData
    {
        return $this->projects->read($this->request->cursors());
    }
}
