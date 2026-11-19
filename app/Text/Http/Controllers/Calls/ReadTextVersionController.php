<?php

declare(strict_types=1);

namespace App\Text\Http\Controllers\Calls;

use App\Numbers\Support\RecordReference;
use App\Records\Contracts\RecordResolver;
use App\Text\Calls\ReadTextVersionCall;
use App\Text\Contracts\TextResolver;
use App\Text\Data\TextVersionInfo;

/**
 * Answers a record's text version.
 */
final readonly class ReadTextVersionController
{
    public function __invoke(ReadTextVersionCall $call, TextResolver $text, RecordResolver $records): TextVersionInfo
    {
        return $text->version($records->identify(RecordReference::parse($call->target)), $call->version);
    }
}
