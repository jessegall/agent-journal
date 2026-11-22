<?php

declare(strict_types=1);

namespace App\Http\Controllers\Calls;

use App\Calls\Text\ReadTextVersionCall;
use App\Contracts\RecordResolver;
use App\Contracts\TextResolver;
use App\Data\TextVersionSummary;
use App\Support\RecordReference;

/**
 * Answers a record's text version.
 */
final readonly class ReadTextVersionController
{
    public function __invoke(ReadTextVersionCall $call, TextResolver $text, RecordResolver $records): TextVersionSummary
    {
        return $text->version($records->identify(RecordReference::parse($call->target)), $call->version);
    }
}
