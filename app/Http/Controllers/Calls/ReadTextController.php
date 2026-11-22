<?php

declare(strict_types=1);

namespace App\Http\Controllers\Calls;

use App\Calls\Text\ReadTextCall;
use App\Contracts\RecordResolver;
use App\Contracts\TextResolver;
use App\Support\RecordReference;
use App\Support\TextPart;

/**
 * Answers the lines or section of a text version asked for.
 */
final readonly class ReadTextController
{
    public function __invoke(ReadTextCall $call, TextResolver $text, RecordResolver $records): TextPart
    {
        $target = $records->identify(RecordReference::parse($call->target));

        return $text->read($target, $call->version, $call->selection());
    }
}
