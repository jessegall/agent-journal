<?php

declare(strict_types=1);

namespace App\Http\Pages;

use App\Connections\ConnectedProjects;
use App\Connections\Data\ConnectProjectWindowData;
use App\Http\Requests\Connections\ConnectProjectRequest;
use App\Reads\PageFormRequests;
use App\Web\Creation\Contracts\PageBuilder;
use Illuminate\Http\Request;

final readonly class ConnectProjectPageBuilder implements PageBuilder
{
    public function __construct(private ConnectedProjects $projects, private PageFormRequests $requests) {}

    public function build(Request $visit): ConnectProjectWindowData
    {
        $request = $this->requests->forVisit(ConnectProjectRequest::class, $visit);

        return $this->projects->read($request->cursors());
    }
}
