<?php

declare(strict_types=1);

namespace App\Http\Pages;

use App\Http\Pages\Settings\SettingsIndex;
use App\Http\Requests\Connections\ConnectProjectRequest;
use App\Reads\PageFormRequests;
use App\Support\Layout\DeclaredLayoutData;
use App\Web\Creation\Contracts\PageBuilder;
use Illuminate\Http\Request;

/**
 * The settings of every owner, for the owner of the journal, as groups in the order the settings page reads in.
 */
final readonly class SettingsPageBuilder implements PageBuilder
{
    public function __construct(private SettingsIndex $layout, private PageFormRequests $requests) {}

    public function build(Request $visit): SettingsPageData
    {
        return SettingsPageData::build()->shown($this->content($visit))->finish();
    }

    private function content(Request $visit): DeclaredLayoutData
    {
        $input = $this->requests->from(ConnectProjectRequest::class, $visit);

        return $this->layout->layout($input->cursors());
    }
}
